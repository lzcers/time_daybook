use log::info;
use serde::{Deserialize, Serialize};

use crate::{
    persistent::{CsvStorage, Persistent},
    utils::get_current_time,
};

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
    current_task_index: u32,
    data_dir: String,
}

impl Persistent<Vec<Task>> for TaskList {
    fn sync_to_disk(&self) -> anyhow::Result<()> {
        let file_path = format!("{}/data/tasklist.csv", self.data_dir);
        CsvStorage::write_serialize_to_file(file_path.as_str(), &self.list)
    }

    fn sync_to_ram(data_dir: &str) -> anyhow::Result<Vec<Task>> {
        let file_path = format!("{}/data/tasklist.csv", data_dir);
        CsvStorage::read_deserialize_from_file(file_path.as_str())
    }
}

impl TaskList {
    pub fn new(data_dir: String) -> Self {
        if let Ok(mut list) = Self::sync_to_ram(data_dir.as_str()) {
            list.sort_by(|a, b| a.id.cmp(&b.id));
            let current_task_index = if let Some(e) = list.last() { e.id } else { 0 };
            TaskList {
                list,
                current_task_index,
                data_dir,
            }
        } else {
            info!("can't laod tasklist from disk, make new records...");
            TaskList {
                list: Vec::new(),
                current_task_index: 0,
                data_dir,
            }
        }
    }
    pub fn get_index(&self) -> u32 {
        self.current_task_index
    }
    pub fn update_index(&mut self) -> u32 {
        self.current_task_index += 1;
        self.current_task_index
    }

    pub fn get_all_task(&self) -> &Vec<Task> {
        &self.list
    }

    pub fn get_task(&self, id: u32) -> Option<&Task> {
        self.list.iter().find(|t| t.id == id)
    }

    pub fn start_task(&mut self, id: u32) {
        if let Some(task) = self.list.iter_mut().find(|t| t.id == id) {
            task.start();
            self.sync_to_disk().expect("sync taskList to disk faild");
        }
    }
    pub fn reset_task_elapsed(&mut self, id: u32) {
        if let Some(task) = self.list.iter_mut().find(|t| t.id == id) {
            task.reset_elapsed();
            self.sync_to_disk().expect("sync taskList to disk faild");
        }
    }

    pub fn add_task_elapsed(&mut self, id: u32, elapsed: u128) {
        if let Some(task) = self.list.iter_mut().find(|t| t.id == id) {
            task.add_elapsed(elapsed);
            self.sync_to_disk().expect("sync taskList to disk faild");
        }
    }

    pub fn add_task(&mut self, task: Task) {
        self.list.push(task);
        self.sync_to_disk().expect("sync taskList to disk faild");
    }

    pub fn delete_task(&mut self, id: u32) {
        self.list.retain(|task| task.id != id);
        self.sync_to_disk().expect("sync taskList to disk faild");
    }

    pub fn update_task(&mut self, new_task: Task) {
        if let Some(t) = self.list.iter_mut().find(|task| task.id == new_task.id) {
            t.name = new_task.name;
            t.status = new_task.status;
        };
        self.sync_to_disk().expect("sync taskList to disk faild");
    }
}
