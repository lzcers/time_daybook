use crate::persistent::{CsvStorage, Persistent};
use log::info;
use serde::{Deserialize, Serialize};
use tauri::api::path;

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
    current_event_index: u32,
    data_dir: String,
}

impl Persistent<Vec<Event>> for TimeLine {
    fn sync_to_disk(&self) -> anyhow::Result<()> {
        let file_path = format!("{}/data/timeline.csv", self.data_dir.as_str());

        CsvStorage::write_serialize_to_file(file_path.as_str(), &self.list)
    }

    fn sync_to_ram(data_dir: &str) -> anyhow::Result<Vec<Event>> {
        let file_path = format!("{}/data/timeline.csv", data_dir);
        CsvStorage::read_deserialize_from_file(file_path.as_str())
    }
}

impl TimeLine {
    pub fn new(data_dir: String) -> Self {
        if let Ok(mut list) = Self::sync_to_ram(data_dir.as_str()) {
            list.sort_by(|a, b| a.id.cmp(&b.id));
            let current_event_index = if let Some(e) = list.last() { e.id } else { 0 };
            TimeLine {
                list,
                current_event_index,
                data_dir,
            }
        } else {
            info!("can't laod timeline from disk, make new records...");
            TimeLine {
                list: Vec::new(),
                current_event_index: 0,
                data_dir,
            }
        }
    }

    pub fn get_index(&self) -> u32 {
        self.current_event_index
    }

    pub fn update_index(&mut self) -> u32 {
        self.current_event_index += 1;
        self.current_event_index
    }

    pub fn get_all_event(&self) -> &Vec<Event> {
        &self.list
    }

    pub fn add_event(&mut self, e: Event) {
        self.list.push(e);
        self.sync_to_disk().expect("sync timeline to disk faild");
    }

    pub fn delete_event_by_task_id(&mut self, task_id: u32) {
        self.list.retain(|e| e.task_id != task_id);
        self.sync_to_disk().expect("sync timeline to disk faild");
    }
}
