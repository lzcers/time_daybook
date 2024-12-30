import { writeFile, readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { open, message } from "@tauri-apps/plugin-dialog";
import JSZip from "jszip";

export const useFS = () => {
    const exportData = async () => {
        const taskListData = await readTextFile("data/tasklist.csv", { baseDir: BaseDirectory.AppLocalData });
        const timelineData = await readTextFile("data/timeline.csv", { baseDir: BaseDirectory.AppLocalData });
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
                const u8data = await content.stream();
                await writeFile(path + "/akashic-data.zip", u8data);
                await message("数据导出成功", { title: "导出", kind: "info" });
            }
        });
    };
    return {
        exportData,
    };
};
