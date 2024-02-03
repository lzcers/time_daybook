use core::panic;

use crate::{task::Task, timeline::Event, AppState};

#[tauri::command]
pub fn new_task(state: tauri::State<AppState>, name: &str, project_id: Option<u32>) -> Option<u32> {
    if let Ok(mut time_friend) = state.time_friend.lock() {
        Some(time_friend.new_task(name, project_id))
    } else {
        None
    }
}

#[tauri::command]
pub fn start_task(state: tauri::State<AppState>, id: u32) -> bool {
    if let Ok(mut time_friend) = state.time_friend.lock() {
        time_friend.start_task(id);
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn pause_task(state: tauri::State<AppState>, id: u32) -> bool {
    if let Ok(mut time_friend) = state.time_friend.lock() {
        time_friend.pause_task(id);
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn get_task_elapsed(state: tauri::State<AppState>, id: u32) -> Option<u128> {
    if let Ok(mut t) = state.time_friend.lock() {
        let clocker_elapsed = t.get_clocker_elapsed();
        let task_eplased = t.get_task(id).and_then(|t| Some(t.elapsed));
        if let (Some(ce), Some(te)) = (clocker_elapsed, task_eplased) {
            Some(ce + te)
        } else {
            None
        }
    } else {
        None
    }
}

#[tauri::command]
pub fn delete_task(state: tauri::State<AppState>, id: u32) -> bool {
    if let Ok(mut t) = state.time_friend.lock() {
        t.delete_task(id);
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn delete_all_task(state: tauri::State<AppState>) -> bool {
    panic!("no impl!")
}

#[tauri::command]
pub fn update_task(state: tauri::State<AppState>, id: u64, name: &str, project_name: &str) -> bool {
    panic!("no impl!")
}

#[tauri::command]
pub fn get_task_event_list(state: tauri::State<AppState>, id: u64) -> Vec<Event> {
    panic!("no impl!");
}

#[tauri::command]
pub fn get_task_list(state: tauri::State<AppState>) -> Vec<Task> {
    if let Ok(mut t) = state.time_friend.lock() {
        t.get_all_task().iter().cloned().collect::<Vec<Task>>()
    } else {
        Vec::new()
    }
}

#[tauri::command]
pub fn reset_task_time(state: tauri::State<AppState>, id: u64) -> bool {
    panic!("no impl!")
}

#[tauri::command]
pub fn reset_all_task_time(state: tauri::State<AppState>) -> bool {
    panic!("no impl!")
}
