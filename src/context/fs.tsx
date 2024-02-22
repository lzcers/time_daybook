import { writeBinaryFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { open, message } from "@tauri-apps/api/dialog";
import JSZip from "jszip";

export const useFS = () => {
    const exportData = async () => {
        const taskListData = await readTextFile("data/tasklist.csv", { dir: BaseDirectory.AppLocalData });
        const timelineData = await readTextFile("data/timeline.csv", { dir: BaseDirectory.AppLocalData });
        const zip = new JSZip();
        zip.file("tasklist.csv", taskListData);
        zip.file("timeline.csv", timelineData);

        zip.generateAsync({ type: "blob" }).then(async content => {
            const path = await open({
                directory: true,
                multiple: false,
                title: "导出数据",
            });
            if (path) {
                const u8data = await content.arrayBuffer();
                await writeBinaryFile(path + "/akashic-data.zip", u8data);
                await message("数据导出成功", { title: "导出", type: "info" });
            }
        });
    };
    return {
        exportData,
    };
};
