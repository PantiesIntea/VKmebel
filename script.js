// Диагностика пазов панели (всё в alert)

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

      const collections = [
        "Cuts", "PanelCuts", "Operations", "Features", "Contours", "Objects", "Children"
      ];

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

              // если есть траектория — покажем её
              try {
                if (item.Trajectory) {
                  info += `   Trajectory.Length: ${item.Trajectory.Length}\n`;
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

      // показываем результат
      alert(info.length > 1000 ? info.substring(0, 1000) + "\n... (обрезано)" : info);
      break;
    }
  }

  if (!foundPanel) {
    alert("Выделенный объект не является панелью.");
  }
}
