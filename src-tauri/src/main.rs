// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
mod clocker;
mod commands;
mod project;
mod task;
mod time_friend;
mod timeline;
mod utils;

use commands::*;
use time_friend::TimeFriend;
struct AppState {
    time_friend: Mutex<TimeFriend>,
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            time_friend: Mutex::new(TimeFriend::new()),
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
