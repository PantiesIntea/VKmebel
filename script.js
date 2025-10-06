const allCuts = [];

if (Model.SelectionCount > 0) {
    for (let i = 0; i < Model.SelectionCount; i++) {
        let obj = Model.Selections[i];
        if (obj instanceof TFurnPanel) searchCuts(obj);
        else if (obj.AsList) searchPanel(obj);
    }
} else {
    Model.forEachPanel(panel => searchCuts(panel));
}

function searchPanel(obj) {
    for (let i = 0; i < obj.Count; i++) {
        if (obj[i] instanceof TFurnPanel) searchCuts(obj[i]);
        else if (obj[i].AsList) searchPanel(obj[i]);
    }
}

function searchCuts(panel) {
    if (!panel.Cuts || panel.Cuts.Count === 0) return;

    for (let i = 0; i < panel.Cuts.Count; i++) {
        let cut = panel.Cuts[i];
        let length = 0;

        // --- вычисляем длину по траектории паза ---
        if (cut.Trajectory && cut.Trajectory.Objects && cut.Trajectory.Objects.length > 0) {
            for (let j = 0; j < cut.Trajectory.Objects.length; j++) {
                let seg = cut.Trajectory.Objects[j];
                // получаем длину каждого сегмента траектории
                if (seg.Length) {
                    length += seg.Length;
                } else if (seg.Start && seg.End) {
                    let dx = seg.End.x - seg.Start.x;
                    let dy = seg.End.y - seg.Start.y;
                    let dz = seg.End.z - seg.Start.z;
                    length += Math.sqrt(dx * dx + dy * dy + dz * dz);
                }
            }
        }

        if (length > 0) {
            allCuts.push({
                Name: cut.Name || "Без имени",
                Type: cut.Type || "Cut",
                Thickness: cut.Thickness ? cut.Thickness.toFixed(1) : "—",
                Length: length.toFixed(1),
            });
        }
    }
}

// --- вывод результата ---
if (allCuts.length > 0) {
    let total = 0, msg = "";
    for (let c of allCuts) {
        msg += `${c.Name}: L=${c.Length} мм, Depth=${c.Thickness} мм\n`;
        total += Number(c.Length);
    }
    msg += `\nОбщая длина всех пазов (вырезов): ${total.toFixed(1)} мм`;
    alert(msg);
} else {
    alert("Пазы (вырезы) не найдены. Убедитесь, что на панели есть операции AddCut().");
}
