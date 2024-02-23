// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Mutex;
use tauri::{SystemTray, SystemTrayEvent};

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

    let system_tray = SystemTray::new();
    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: p,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.set_position(p).unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
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
