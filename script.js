// Подсчёт общей длины всех пазов (Cuts) на панели, включая траектории любого типа

let totalLength = 0;
let totalCuts = 0;

function getCutLength(cut) {
  let len = 0;

  try {
    // 🔹 Если у паза есть прямая длина (часто встречается)
    if (cut.Trajectory && typeof cut.Trajectory.Length === "number") {
      len += cut.Trajectory.Length;
    }
    // 🔹 Если у паза есть список объектов (траектория состоит из линий, дуг и т.д.)
    else if (cut.Trajectory && cut.Trajectory.Objects && cut.Trajectory.Objects.Count > 0) {
      for (let i = 0; i < cut.Trajectory.Objects.Count; i++) {
        const obj = cut.Trajectory.Objects[i];
        if (obj instanceof TLine3D) {
          const dx = obj.P2.x - obj.P1.x;
          const dy = obj.P2.y - obj.P1.y;
          const dz = obj.P2.z - obj.P1.z;
          len += Math.sqrt(dx * dx + dy * dy + dz * dz);
        } else if (obj instanceof TArc3D) {
          len += Math.abs(obj.Radius * obj.Angle);
        } else if (typeof obj.Length === "number") {
          len += obj.Length;
        }
      }
    }
    // 🔹 Попробуем напрямую, если у самого Cut есть Length
    else if (typeof cut.Length === "number") {
      len += cut.Length;
    }
  } catch (e) {
    // Если что-то не удалось — просто пропускаем
  }

  return len;
}

function processPanel(panel) {
  if (!panel.Cuts || panel.Cuts.Count === 0) return;

  for (let i = 0; i < panel.Cuts.Count; i++) {
    const cut = panel.Cuts[i];
    const len = getCutLength(cut);
    totalLength += len;
    totalCuts++;
  }
}

function searchInList(list) {
  for (let i = 0; i < list.Count; i++) {
    const obj = list[i];
    if (obj instanceof TFurnPanel) {
      processPanel(obj);
    } else if (obj.AsList) {
      searchInList(obj);
    }
  }
}

if (Model.SelectionCount > 0) {
  for (let i = 0; i < Model.SelectionCount; i++) {
    const obj = Model.Selections[i];
    if (obj instanceof TFurnPanel) {
      processPanel(obj);
    } else if (obj.AsList) {
      searchInList(obj);
    }
  }
} else {
  Model.forEachPanel(panel => processPanel(panel));
}

if (totalCuts > 0) {
  alert(`Найдено пазов: ${totalCuts}\nОбщая длина: ${totalLength.toFixed(2)} мм`);
} else {
  alert("Пазы (вырезы) не найдены. Убедитесь, что на панели есть операции AddCut().");
}
