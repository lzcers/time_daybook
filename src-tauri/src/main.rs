// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
mod clocker;
mod commands;
mod persistent;
mod project;
mod task;
mod time_friend;
mod timeline;
mod utils;

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
        .setup(|app| {
            let local_app_data_dir = app
                .handle()
                .path_resolver()
                .app_data_dir()
                .unwrap()
                .to_str()
                .unwrap()
                .to_string();
            info!("get local app data: {:?}", &local_app_data_dir);
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
            get_task_event_list,
            get_task_list,
            reset_task,
            reset_all_task,
            get_task_elapsed,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
