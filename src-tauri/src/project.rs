use crate::utils::get_current_time;

pub enum ProjectStaus {
    Ready,
    Processing,
    Done,
}

pub struct Project {
    pub id: u32,
    pub name: String,
    pub progress: f32,
    pub status: ProjectStaus,
    create_time: u128,
    end_time: Option<u128>,
    task_list: Vec<u32>,
}
impl Project {
    pub fn new(id: u32, name: &str) -> Self {
        Self {
            id,
            name: name.to_owned(),
            progress: 0.0,
            status: ProjectStaus::Ready,
            create_time: get_current_time(),
            end_time: None,
            task_list: Vec::new(),
        }
    }
    pub fn start(&mut self) {
        self.status = ProjectStaus::Processing;
    }

    pub fn end(&mut self) {
        self.status = ProjectStaus::Done;
        self.end_time = Some(get_current_time());
    }

    pub fn has_task(&self, id: &u32) -> bool {
        self.task_list.contains(&id)
    }

    pub fn add_task_id(&mut self, id: u32) {
        if !self.task_list.contains(&id) {
            self.task_list.push(id);
        }
    }
    pub fn delete_task_id(&mut self, id: u32) {
        self.task_list.retain(|i| *i != id)
    }
}

pub struct ProjectList {
    list: Vec<Project>,
}

impl ProjectList {
    pub fn new() -> Self {
        Self { list: Vec::new() }
    }

    pub fn get_all_project(&mut self) -> &mut Vec<Project> {
        &mut self.list
    }

    pub fn get_project(&self, id: u32) -> Option<&Project> {
        self.list.iter().find(|t| t.id == id)
    }

    pub fn add_project(&mut self, project: Project) {
        self.list.push(project)
    }

    pub fn delete_project(&mut self, id: u32) {
        self.list.retain(|task| task.id != id)
    }

    pub fn update_project(&mut self, new_project: Project) {
        if let Some(t) = self.list.iter_mut().find(|task| task.id == new_project.id) {
            t.name = new_project.name;
            t.status = new_project.status;
        }
    }

    pub fn delete_task_from_project(&mut self, task_id: u32) {
        self.list.iter_mut().for_each(|proj| {
            if (proj.has_task(&task_id)) {
                proj.delete_task_id(task_id);
            }
        })
    }
}
