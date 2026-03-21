use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

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
fn open_external_url(url: String) -> Result<(), String> {
    if !url.starts_with("https://") && !url.starts_with("http://") {
        return Err("Only http and https URLs are allowed.".to_string());
    }

    #[cfg(target_os = "linux")]
    let mut command = {
        let mut command = Command::new("xdg-open");
        command.arg(&url);
        command
    };

    #[cfg(target_os = "macos")]
    let mut command = {
        let mut command = Command::new("open");
        command.arg(&url);
        command
    };

    #[cfg(target_os = "windows")]
    let mut command = {
        let mut command = Command::new("cmd");
        command.args(["/C", "start", "", &url]);
        command
    };

    let status = command
        .status()
        .map_err(|error| format!("Failed to launch external URL: {}", error))?;

    if status.success() {
        Ok(())
    } else {
        Err(format!("xdg-open exited with status {:?}", status.code()))
    }
}

#[tauri::command]
fn print_pdf_bytes(bytes: Vec<u8>, copies: Option<u32>) -> Result<(), String> {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| error.to_string())?
        .as_millis();
    let output_path: PathBuf =
        std::env::temp_dir().join(format!("easy-photo-print-{}.pdf", timestamp));

    fs::write(&output_path, bytes).map_err(|error| error.to_string())?;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_startup_image_paths,
            open_external_url,
            print_pdf_bytes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
