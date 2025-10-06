// Диагностика пазов панели с подсчетом общего количества и длины

let totalLength = 0;
let totalCuts = 0;

// Функция вычисления длины одного паза по траектории
function getCutLength(cut) {
  if (!cut.Trajectory || cut.Trajectory.Objects.Count === 0) return 0;

  let length = 0;
  for (let i = 0; i < cut.Trajectory.Objects.Count; i++) {
    const obj = cut.Trajectory.Objects[i];

    if (obj instanceof TLine3D) {
      // Прямая линия
      const dx = obj.P2.x - obj.P1.x;
      const dy = obj.P2.y - obj.P1.y;
      const dz = obj.P2.z - obj.P1.z;
      length += Math.sqrt(dx * dx + dy * dy + dz * dz);
    } else if (obj instanceof TArc3D) {
      // Дуга
      length += Math.abs(obj.Radius * obj.Angle);
    } else {
      // Другие типы элементов (например, сплайны)
      try {
        length += obj.Length;
      } catch (e) {
        // Пропускаем, если нет свойства Length
      }
    }
  }
  return length;
}

if (Model.SelectionCount === 0) {
  alert("Выбери хотя бы одну панель в модели.");
} else {
  let foundPanel = false;

  for (let i = 0; i < Model.SelectionCount; i++) {
    const obj = Model.Selections[i];
    if (obj instanceof TFurnPanel) {
      foundPanel = true;
      const panel = obj;

      let info = "📘 Панель: " + panel.Name + "\n";

      const collections = ["Cuts", "PanelCuts", "Operations", "Features", "Contours", "Objects", "Children"];

      let foundSomething = false;

      for (let name of collections) {
        try {
          const c = panel[name];
          if (c && typeof c.Count === "number" && c.Count > 0) {
            foundSomething = true;
            info += `\n=== ${name} (${c.Count}) ===\n`;

            for (let j = 0; j < c.Count; j++) {
              const item = c[j];
              info += `[${j}] ${item.ClassName || "без типа"}\n`;

              // основные данные
              const keys = ["Name", "Type", "Length", "Depth", "Width", "Thickness"];
              for (let k of keys) {
                try {
                  if (typeof item[k] !== "undefined") {
                    info += `   ${k}: ${item[k]}\n`;
                  }
                } catch {}
              }

              // если есть траектория — считаем длину
              try {
                if (item.Trajectory) {
                  const len = getCutLength(item);
                  totalLength += len;
                  totalCuts++;
                  info += `   Trajectory.Length: ${len.toFixed(2)} мм\n`;
                  if (item.Trajectory.Objects && item.Trajectory.Objects.Count > 0) {
                    info += `   Trajectory.Objects.Count: ${item.Trajectory.Objects.Count}\n`;
                  }
                }
              } catch {}

              // если есть контур — покажем его
              try {
                if (item.Contour && item.Contour.Objects) {
                  info += `   Contour.Objects.Count: ${item.Contour.Objects.Count}\n`;
                }
              } catch {}
            }
          }
        } catch (e) {
          info += `Ошибка доступа к ${name}\n`;
        }
      }

      if (!foundSomething) {
        info += "\n❌ Похоже, пазы не найдены ни в одном свойстве панели.";
      }

      // Добавляем общую информацию
      if (totalCuts > 0) {
        info += `\n📏 Общее количество пазов: ${totalCuts}\n📏 Общая длина пазов: ${totalLength.toFixed(2)} мм`;
      }

      // показываем результат
      alert(info.length > 1000 ? info.substring(0, 1000) + "\n... (обрезано)" : info);
      break;
    }
  }

  if (!foundPanel) {
    alert("Выделенный объект не является панелью.");
  }
}
