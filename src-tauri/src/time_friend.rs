use crate::{
    clocker::Clocker,
    project::ProjectList,
    task::{Task, TaskList},
    timeline::{Event, TimeLine},
};

pub struct TimeFriend {
    current_task_index: u32,
    current_event_index: u32,
    current_project_index: u32,
    running_clocker: Option<Clocker>,
    task_list: TaskList,
    project_list: ProjectList,
    time_line: TimeLine,
}

impl<'a> TimeFriend {
    pub fn new() -> Self {
        Self {
            current_task_index: 0,
            current_event_index: 0,
            current_project_index: 0,
            running_clocker: None,
            task_list: TaskList::new(),
            project_list: ProjectList::new(),
            time_line: TimeLine::new(),
        }
    }
    pub fn new_task(&mut self, name: &str, project_id: Option<u32>) -> u32 {
        let task = Task::new(self.current_task_index, name);
        let task_id = task.id;
        self.task_list.add_task(task);
        self.current_task_index += 1;
        // 有关联项目

        if let Some(pid) = project_id {
            let proj = self
                .project_list
                .get_all_project()
                .iter_mut()
                .find(|p| p.id == pid);

            proj.map(|p| p.add_task_id(pid));
        }
        task_id
    }
    pub fn delete_task(&mut self, id: u32) {
        // 从任务列表中删除
        self.task_list.delete_task(id);
        // 从项目中清除
        self.project_list.delete_task_from_project(id);
        // 删除任务相关的所有事件
        self.time_line.delete_event_by_task_id(id);
    }

    pub fn get_all_task(&mut self) -> &mut Vec<Task> {
        self.task_list.get_all_task()
    }

    pub fn start_task(&mut self, task_id: u32) {
        let mut clocker = Clocker::new();
        clocker.start();
        self.running_clocker = Some(clocker);
    }

    pub fn pause_task(&mut self, task_id: u32) {
        if let (Some(task), Some(clocker)) =
            (self.task_list.get_task(task_id), &mut self.running_clocker)
        {
            clocker.stop();
            let end_time = clocker
                .end_time
                .read()
                .expect("read the clocker end_time failed");
            if end_time.is_some() {
                task.add_elapsed(*clocker.elapsed.read().unwrap());
                self.time_line.add_event(Event::new(
                    self.current_event_index,
                    task_id,
                    clocker.start_time,
                    end_time.unwrap(),
                ));
                self.current_event_index += 1;
            } else {
                panic!("clocker was not stopepd! Attempt to pause the task failed.")
            }
        }
        self.running_clocker = None;
    }

    pub fn get_task(&mut self, id: u32) -> Option<&Task> {
        self.task_list.get_task(id).and_then(|t| Some(&*t))
    }

    pub fn get_clocker_elapsed(&self) -> Option<u128> {
        if let Some(clocker) = &self.running_clocker {
            Some(*clocker.elapsed.read().unwrap())
        } else {
            None
        }
    }
}
