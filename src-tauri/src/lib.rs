use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

fn write_temp_pdf(bytes: Vec<u8>) -> Result<PathBuf, String> {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| error.to_string())?
        .as_millis();
    let output_path: PathBuf =
        std::env::temp_dir().join(format!("easy-photo-print-{}.pdf", timestamp));

    fs::write(&output_path, bytes).map_err(|error| error.to_string())?;

    Ok(output_path)
}

fn open_path_in_default_app(path: &PathBuf) -> Result<(), String> {
    #[cfg(target_os = "linux")]
    let status = open_linux_target(path.as_os_str().to_string_lossy().as_ref())
        .map_err(|error| format!("Failed to open generated PDF: {}", error))?;

    #[cfg(target_os = "macos")]
    let status = Command::new("open")
        .arg(path)
        .status()
        .map_err(|error| format!("Failed to open generated PDF: {}", error))?;

    #[cfg(target_os = "windows")]
    let status = Command::new("cmd")
        .args(["/C", "start", "", &path.display().to_string()])
        .status()
        .map_err(|error| format!("Failed to open generated PDF: {}", error))?;

    if status.success() {
        Ok(())
    } else {
        Err(format!(
            "Opening the generated PDF exited with status {:?}",
            status.code()
        ))
    }
}

#[cfg(target_os = "linux")]
async fn open_pdf_via_flatpak_print_portal(path: &PathBuf) -> Result<(), String> {
    use std::fs::File;

    use ashpd::desktop::print::{PrintOptions, PrintProxy};

    let proxy = PrintProxy::new()
        .await
        .map_err(|error| format!("Failed to connect to the Flatpak print portal: {}", error))?;

    let file = File::open(path)
        .map_err(|error| format!("Failed to reopen the generated PDF for printing: {}", error))?;

    eprintln!("EasyPhotoPrint Flatpak: requesting print portal dialog");

    let request = proxy
        .print(None, "EasyPhotoPrint", &file, PrintOptions::default().set_modal(true))
        .await
        .map_err(|error| format!("Failed to open the Flatpak print dialog: {}", error))?;

    request
        .response()
        .map_err(|error| format!("The Flatpak print dialog did not complete successfully: {}", error))?;

    eprintln!("EasyPhotoPrint Flatpak: print portal dialog completed");

    Ok(())
}

#[cfg(target_os = "linux")]
fn open_linux_target(target: &str) -> Result<std::process::ExitStatus, String> {
    match Command::new("gio").args(["open", target]).status() {
        Ok(status) => Ok(status),
        Err(_) => Command::new("xdg-open")
            .arg(target)
            .status()
            .map_err(|error| error.to_string()),
    }
}

#[tauri::command]
fn get_startup_image_paths() -> Vec<String> {
    std::env::args()
        .skip(1)
        .filter_map(|arg| {
            let path = PathBuf::from(&arg);

            if !path.is_file() {
                return None;
            }

            let extension = path
                .extension()
                .and_then(|value| value.to_str())
                .map(|value| value.to_ascii_lowercase())?;

            let is_supported = matches!(
                extension.as_str(),
                "png" | "jpg" | "jpeg" | "webp" | "gif" | "bmp"
            );

            if is_supported {
                Some(path.to_string_lossy().to_string())
            } else {
                None
            }
        })
        .collect()
}

#[tauri::command]
fn is_flatpak_runtime() -> bool {
    #[cfg(target_os = "linux")]
    {
        std::env::var_os("FLATPAK_ID").is_some() || PathBuf::from("/.flatpak-info").is_file()
    }

    #[cfg(not(target_os = "linux"))]
    {
        false
    }
}

#[tauri::command]
async fn retrieve_flatpak_transfer_files(key: String) -> Result<Vec<String>, String> {
    #[cfg(target_os = "linux")]
    {
        use ashpd::documents::file_transfer::{FileTransfer, RetrieveFilesOptions};

        let proxy = FileTransfer::new()
            .await
            .map_err(|error| format!("Failed to connect to the Flatpak file transfer portal: {}", error))?;

        proxy
            .retrieve_files(&key, RetrieveFilesOptions::default())
            .await
            .map_err(|error| format!("Failed to retrieve dropped files from the Flatpak portal: {}", error))
    }

    #[cfg(not(target_os = "linux"))]
    {
        let _ = key;
        Err("Flatpak file transfer retrieval is only available on Linux.".to_string())
    }
}

#[tauri::command]
fn open_external_url(url: String) -> Result<(), String> {
    if !url.starts_with("https://") && !url.starts_with("http://") {
        return Err("Only http and https URLs are allowed.".to_string());
    }

    #[cfg(target_os = "linux")]
    let status = open_linux_target(&url)
        .map_err(|error| format!("Failed to launch external URL: {}", error))?;

    #[cfg(target_os = "macos")]
    let status = Command::new("open")
        .arg(&url)
        .status()
        .map_err(|error| format!("Failed to launch external URL: {}", error))?;

    #[cfg(target_os = "windows")]
    let status = Command::new("cmd")
        .args(["/C", "start", "", &url])
        .status()
        .map_err(|error| format!("Failed to launch external URL: {}", error))?;

    if status.success() {
        Ok(())
    } else {
        Err(format!("Opening the external URL exited with status {:?}", status.code()))
    }
}

#[tauri::command]
fn print_pdf_bytes(bytes: Vec<u8>, copies: Option<u32>) -> Result<(), String> {
    let output_path = write_temp_pdf(bytes)?;

    let copies = copies.unwrap_or(1).max(1);

    #[cfg(any(target_os = "linux", target_os = "macos"))]
    let status = Command::new("lp")
        .arg("-n")
        .arg(copies.to_string())
        .arg(&output_path)
        .status()
        .map_err(|error| {
            format!(
                "Failed to start 'lp'. Ensure CUPS printing is installed and available: {}",
                error
            )
        })?;

    #[cfg(target_os = "windows")]
    let status = {
        for _ in 0..copies {
            let powershell_command = format!(
                "Start-Process -FilePath '{}' -Verb Print",
                output_path.display().to_string().replace('\'', "''")
            );

            let print_status = Command::new("powershell")
                .args(["-NoProfile", "-Command", &powershell_command])
                .status()
                .map_err(|error| {
                    format!(
                        "Failed to start Windows printing. Ensure a PDF viewer with print support is installed: {}",
                        error
                    )
                })?;

            if !print_status.success() {
                return Err(format!(
                    "Windows print command exited with status {:?}. The PDF was written to {}",
                    print_status.code(),
                    output_path.display()
                ));
            }
        }

        Command::new("cmd")
            .args(["/C", "exit", "0"])
            .status()
            .map_err(|error| error.to_string())?
    };

    if status.success() {
        Ok(())
    } else {
        Err(format!(
            "'lp' exited with status {:?}. The PDF was written to {}",
            status.code(),
            output_path.display()
        ))
    }
}

#[tauri::command]
async fn open_pdf_bytes(bytes: Vec<u8>) -> Result<String, String> {
    let output_path = write_temp_pdf(bytes)?;

    #[cfg(target_os = "linux")]
    if is_flatpak_runtime() {
        open_pdf_via_flatpak_print_portal(&output_path).await?;
        return Ok(String::new());
    }

    open_path_in_default_app(&output_path)?;
    Ok(output_path.display().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_startup_image_paths,
            is_flatpak_runtime,
            retrieve_flatpak_transfer_files,
            open_external_url,
            print_pdf_bytes,
            open_pdf_bytes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
