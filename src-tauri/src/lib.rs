use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

#[tauri::command]
fn open_external_url(url: String) -> Result<(), String> {
    if !url.starts_with("https://") && !url.starts_with("http://") {
        return Err("Only http and https URLs are allowed.".to_string());
    }

    let status = Command::new("xdg-open")
        .arg(url)
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

    let status = Command::new("lp")
        .arg("-n")
        .arg(copies.unwrap_or(1).max(1).to_string())
        .arg(&output_path)
        .status()
        .map_err(|error| {
            format!(
                "Failed to start 'lp'. Ensure CUPS printing is installed and available: {}",
                error
            )
        })?;

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
        .invoke_handler(tauri::generate_handler![open_external_url, print_pdf_bytes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
