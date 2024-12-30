use super::time_slice::{self, TimeSlice};

// 时间线即由时间切片组成的有序列表
pub struct Timeline {
    pub list: Vec<TimeSlice>,
}

impl Timeline {
    pub fn new() -> Self {
        return Timeline { list: vec![] };
    }

    // 向时间线中添加一个时间切片
    // todo: 有序插入，即插入过程中保持时间线的有序性
    pub fn push(&mut self, time_slice: TimeSlice) {
        self.list.push(time_slice);
    }

    pub fn remove(&mut self, ind: u64) {}
}
