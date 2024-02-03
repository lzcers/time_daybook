use serde::{Deserialize, Serialize};

use crate::utils::get_current_time;

#[derive(Serialize, Deserialize, Clone, PartialEq)]
pub enum TaskStatus {
    Ready,
    Processing,
    Done,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Task {
    pub id: u32,
    pub name: String,
    pub create_time: u128,
    pub end_time: Option<u128>,
    pub elapsed: u128,
    pub status: TaskStatus,
}

impl Task {
    pub fn new(id: u32, name: &str) -> Self {
        Task {
            id,
            name: name.to_owned(),
            create_time: get_current_time(),
            end_time: None,
            elapsed: 0,
            status: TaskStatus::Ready,
        }
    }

    pub fn start(&mut self) {
        self.status = TaskStatus::Processing;
    }

    pub fn add_elapsed(&mut self, elapsed: u128) {
        self.elapsed += elapsed;
    }

    pub fn reset_elapsed(&mut self) {
        self.elapsed = 0;
    }

    pub fn done(&mut self) {
        self.end_time = Some(get_current_time());
        self.status = TaskStatus::Done;
    }
}

pub struct TaskList {
    list: Vec<Task>,
}

impl TaskList {
    pub fn new() -> Self {
        TaskList { list: Vec::new() }
    }

    pub fn get_all_task(&mut self) -> &mut Vec<Task> {
        &mut self.list
    }

    pub fn get_task(&mut self, id: u32) -> Option<&mut Task> {
        self.list.iter_mut().find(|t| t.id == id)
    }

    pub fn add_task(&mut self, task: Task) {
        self.list.push(task)
    }

    pub fn delete_task(&mut self, id: u32) {
        self.list.retain(|task| task.id != id)
    }

    pub fn update_task(&mut self, new_task: Task) {
        if let Some(t) = self.list.iter_mut().find(|task| task.id == new_task.id) {
            t.name = new_task.name;
            t.status = new_task.status;
        }
    }
}
