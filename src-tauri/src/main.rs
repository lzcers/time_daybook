// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Mutex;
use tauri::tray::TrayIconBuilder;

mod commands;
mod persistent;
mod project;
mod task;
mod time;
mod time_friend;
mod timeline;

use commands::*;
use log::info;
use tauri::Manager;
use time_friend::TimeFriend;

struct AppState {
    time_friend: Mutex<TimeFriend>,
}

fn main() {
    // 开启日志
    env_logger::init();

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let local_app_data_dir = app
                .path()
                .app_local_data_dir()?
                .to_str()
                .unwrap()
                .to_string();

            info!("get local app data: {:?}", &local_app_data_dir);

            // let tray = TrayIconBuilder::new().build(app)?;

            app.manage(AppState {
                time_friend: Mutex::new(TimeFriend::new(local_app_data_dir)),
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            new_task,
            start_task,
            pause_task,
            delete_task,
            delete_all_task,
            update_task,
            done_task,
            processing_task,
            get_task_event_list,
            get_task_list,
            reset_task,
            reset_all_task,
            get_task_elapsed,
            get_today_elapsed,
            get_all_elapsed,
            delete_event,
            add_event_by_datetime,
            swap_task_by_index
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
