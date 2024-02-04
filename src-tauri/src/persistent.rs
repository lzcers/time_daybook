use anyhow::{bail, Context, Result};
use log::{error, info, warn};
use serde::{de::DeserializeOwned, Serialize};
use std::{fs, path::Path};

pub trait Persistent<T> {
    fn sync_to_disk(&self) -> Result<()>;
    fn sync_to_ram(data_dir: &str) -> Result<T>;
}

pub struct CsvStorage;

impl CsvStorage {
    pub fn write_serialize_to_file<T: Serialize>(dir_path: &str, data: &Vec<T>) -> Result<()> {
        let path = Path::new(dir_path);
        fs::create_dir_all(path.parent().unwrap()).with_context(|| {
            error!("CsvStorage: create data dir failed!");
            format!("create dir failed: {}", dir_path)
        })?;
        let mut wtr = csv::Writer::from_path(dir_path)?;
        for row in data {
            wtr.serialize(row)?;
        }
        info!("CsvStorage: sync data to disk successfully.");
        Ok(())
    }

    pub fn read_deserialize_from_file<T: DeserializeOwned>(dir_path: &str) -> Result<Vec<T>> {
        let path = Path::new(dir_path);
        if !path.exists() {
            warn!("data dir is not exists! {}", dir_path);
            bail!("data dir is not exists! {}", dir_path);
        }
        let mut rdr = csv::Reader::from_path(dir_path)?;
        let iter = rdr.deserialize();
        let mut result: Vec<T> = Vec::<T>::new();
        for row in iter {
            let record: T = row?;
            result.push(record);
        }
        info!("CsvStorage: sync data to ram successfully.");
        Ok(result)
    }
}
