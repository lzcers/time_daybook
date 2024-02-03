use std::{
    sync::{Arc, RwLock},
    thread::{self, JoinHandle},
    time::{Duration, Instant},
};

use crate::utils::get_current_time;

pub struct Clocker {
    pub start_time: u128,
    pub end_time: Arc<RwLock<Option<u128>>>,
    pub elapsed: Arc<RwLock<u128>>,
    handle: Option<JoinHandle<()>>,
}

impl Clocker {
    pub fn new() -> Self {
        Clocker {
            start_time: get_current_time(),
            end_time: Arc::new(RwLock::new(None)),
            elapsed: Arc::new(RwLock::new(0)),
            handle: None,
        }
    }
    pub fn start(&mut self) {
        let end_time = self.end_time.clone();
        let elapsed = self.elapsed.clone();
        self.handle = Some(thread::spawn(move || {
            let timer = Instant::now();
            loop {
                if (*end_time.read().expect("read the clocker end_time failed")).is_some() {
                    break;
                }
                // 每隔 100 毫秒
                thread::sleep(Duration::from_millis(100));
                let mut elapsed_ref = elapsed.write().unwrap();
                *elapsed_ref = timer.elapsed().as_millis();
            }
        }));
    }
    pub fn stop(&mut self) {
        let mut end_time = self.end_time.write().unwrap();
        *end_time = Some(get_current_time());
        drop(end_time);

        if let Some(handle) = self.handle.take() {
            handle.join().expect("trying to stop the clocker failed");
            self.handle = None;
        }
    }
}
