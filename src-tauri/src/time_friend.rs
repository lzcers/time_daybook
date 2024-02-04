use crate::{
    clocker::Clocker,
    project::ProjectList,
    task::{Task, TaskList, TaskStatus},
    timeline::{Event, TimeLine},
};

pub struct TimeFriend {
    running_clocker: Option<(u32, Clocker)>,
    task_list: TaskList,
    project_list: ProjectList,
    time_line: TimeLine,
}

impl TimeFriend {
    pub fn new(path: String) -> TimeFriend {
        let data_dir = path.clone();
        TimeFriend {
            running_clocker: None,
            task_list: TaskList::new(path),
            time_line: TimeLine::new(data_dir.clone()),
            project_list: ProjectList::new(),
        }
    }
    pub fn new_task(&mut self, name: &str, project_id: Option<u32>) -> u32 {
        let task = Task::new(self.task_list.get_index(), name);
        let task_id = task.id;
        self.task_list.add_task(task);
        self.task_list.update_index();
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

    pub fn delete_all_task(&mut self) {
        self.stop_running_clocker();
        let mut ids: Vec<u32> = vec![];
        self.task_list.get_all_task().iter().for_each(|task| {
            if task.status != TaskStatus::Done {
                ids.push(task.id)
            }
        });
        ids.into_iter().for_each(|id| self.delete_task(id));
    }

    pub fn get_all_task(&self) -> &Vec<Task> {
        self.task_list.get_all_task()
    }

    pub fn start_task(&mut self, task_id: u32) {
        self.stop_running_clocker();
        let mut clocker = Clocker::new();
        clocker.start();
        self.task_list.start_task(task_id);
        self.running_clocker = Some((task_id, clocker));
    }

    pub fn pause_task(&mut self, task_id: u32) {
        let result = if let Some((run_id, clocker)) = self.running_clocker.as_mut() {
            if *run_id != task_id {
                return;
            }
            clocker.stop();
            let end_time = clocker
                .end_time
                .read()
                .expect("read the clocker end_time failed");
            if end_time.is_some() {
                self.task_list
                    .add_task_elapsed(task_id, *clocker.elapsed.read().unwrap());
                self.time_line.add_event(Event::new(
                    self.time_line.get_index(),
                    task_id,
                    clocker.start_time,
                    end_time.unwrap(),
                ));
                self.time_line.update_index();
            } else {
                panic!("clocker was not stopepd! Attempt to pause the task failed.")
            }
            Some(())
        } else {
            None
        };
        if result.is_some() {
            self.running_clocker = None;
        }
    }

    pub fn get_task(&mut self, id: u32) -> Option<&Task> {
        self.task_list.get_task(id).and_then(|t| Some(&*t))
    }

    pub fn reset_task(&mut self, task_id: u32) {
        self.task_list.reset_task_elapsed(task_id);
        self.time_line.delete_event_by_task_id(task_id);
    }

    pub fn reset_all_task(&mut self) {
        self.stop_running_clocker();
        let task_ids = self
            .task_list
            .get_all_task()
            .iter()
            .filter(|task| task.status != TaskStatus::Done)
            .map(|t| t.id)
            .collect::<Vec<u32>>();
        for id in task_ids {
            self.task_list.reset_task_elapsed(id);
            self.time_line.delete_event_by_task_id(id);
        }
    }

    pub fn stop_running_clocker(&mut self) {
        let mut tid: Option<u32> = None;
        match self.running_clocker.as_mut() {
            Some((task_id, _)) => tid = Some(*task_id),
            _ => {}
        }
        tid.map(|id| {
            self.pause_task(id);
        });
    }

    pub fn get_clocker_elapsed(&self, task_id: u32) -> Option<u128> {
        if let Some((run_id, clocker)) = &self.running_clocker {
            if *run_id == task_id {
                Some(*clocker.elapsed.read().unwrap())
            } else {
                None
            }
        } else {
            None
        }
    }
}
