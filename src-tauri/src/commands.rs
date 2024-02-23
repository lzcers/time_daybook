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
pub fn swap_task_by_index(
    state: tauri::State<AppState>,
    old_index: usize,
    new_index: usize,
) -> bool {
    if let Ok(mut time_friend) = state.time_friend.lock() {
        time_friend.swap_task_by_index(old_index, new_index);
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn add_event_by_datetime(
    state: tauri::State<AppState>,
    task_id: u32,
    start_time: u64,
    end_time: u64,
) -> bool {
    if let Ok(mut time_friend) = state.time_friend.lock() {
        time_friend.add_event_by_datetime(task_id, start_time as u128, end_time as u128);
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn get_task_event_list(state: tauri::State<AppState>, id: u32) -> Vec<Event> {
    if let Ok(time_friend) = state.time_friend.lock() {
        time_friend
            .get_task_event_list(id)
            .into_iter()
            .map(|e| e.clone())
            .collect()
    } else {
        vec![]
    }
}
#[tauri::command]
pub fn delete_event(state: tauri::State<AppState>, id: u32) -> bool {
    if let Ok(mut time_friend) = state.time_friend.lock() {
        time_friend.delete_event(id);
        true
    } else {
        false
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
        let clocker_elapsed = t.get_clocker_elapsed(id);
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
pub fn get_all_elapsed(state: tauri::State<AppState>) -> Option<u128> {
    if let Ok(t) = state.time_friend.lock() {
        Some(t.get_all_elapsed())
    } else {
        None
    }
}

#[tauri::command]
pub fn get_today_elapsed(state: tauri::State<AppState>) -> Option<u128> {
    if let Ok(t) = state.time_friend.lock() {
        Some(t.get_today_elapsed())
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
    if let Ok(mut t) = state.time_friend.lock() {
        t.delete_all_task();
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn update_task(state: tauri::State<AppState>, id: u32, name: &str) -> bool {
    if let Ok(mut t) = state.time_friend.lock() {
        t.update_task(id, name, None);
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn done_task(state: tauri::State<AppState>, id: u32) -> bool {
    if let Ok(mut t) = state.time_friend.lock() {
        t.done_task(id);
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn processing_task(state: tauri::State<AppState>, id: u32) -> bool {
    if let Ok(mut t) = state.time_friend.lock() {
        t.processing_task(id);
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn get_task_list(state: tauri::State<AppState>) -> Vec<Task> {
    if let Ok(t) = state.time_friend.lock() {
        t.get_all_task().iter().cloned().collect::<Vec<Task>>()
    } else {
        Vec::new()
    }
}

#[tauri::command]
pub fn reset_task(state: tauri::State<AppState>, id: u32) -> bool {
    if let Ok(mut t) = state.time_friend.lock() {
        t.reset_task(id);
        true
    } else {
        false
    }
}

#[tauri::command]
pub fn reset_all_task(state: tauri::State<AppState>) -> bool {
    if let Ok(mut t) = state.time_friend.lock() {
        t.reset_all_task();
        true
    } else {
        false
    }
}
