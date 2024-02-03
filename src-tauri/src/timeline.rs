use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Event {
    id: u32,
    task_id: u32,
    start_time: u128,
    end_time: u128,
}

impl Event {
    pub fn new(id: u32, task_id: u32, start_time: u128, end_time: u128) -> Self {
        Self {
            id,
            task_id,
            start_time,
            end_time,
        }
    }
}

pub struct TimeLine {
    list: Vec<Event>,
}

impl TimeLine {
    pub fn new() -> Self {
        return TimeLine { list: Vec::new() };
    }
    pub fn add_event(&mut self, e: Event) {
        self.list.push(e);
    }
    pub fn delete_event_by_task_id(&mut self, task_id: u32) {
        self.list.retain(|e| e.task_id == task_id)
    }
}
