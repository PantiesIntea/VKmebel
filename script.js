let totalLen = 0;
let totalCuts = 0;

function getCutLen(cut) {
  let len = 0;

  // 1. Попытка via Trajectory.Length
  if (cut.Trajectory && typeof cut.Trajectory.Length === "number") {
    len += cut.Trajectory.Length;
  }

  // 2. Попытка via Trajectory.Objects
  if (cut.Trajectory && cut.Trajectory.Objects && cut.Trajectory.Objects.Count) {
    for (let i = 0; i < cut.Trajectory.Objects.Count; i++) {
      let obj = cut.Trajectory.Objects[i];
      if (typeof obj.Length === "number") {
        len += obj.Length;
      } else {
        // попробовать как линия между P1 и P2
        if (obj.P1 && obj.P2) {
          let dx = obj.P2.x - obj.P1.x;
          let dy = obj.P2.y - obj.P1.y;
          let dz = obj.P2.z - obj.P1.z;
          len += Math.sqrt(dx*dx + dy*dy + dz*dz);
        }
      }
    }
  }

  // 3. Попытка via cut.Length
  if (typeof cut.Length === "number") {
    len += cut.Length;
  }

  // 4. Если всё ещё ноль — попробуем считать по cut.Contour (2D контур)
  if (len === 0 && cut.Contour && cut.Contour.Objects && cut.Contour.Objects.Count) {
    for (let i = 0; i < cut.Contour.Objects.Count; i++) {
      let co = cut.Contour.Objects[i];
      if (typeof co.ObjLength === "function") {
        len += co.ObjLength();
      } else if (co.Pos1 && co.Pos2) {
        let dx = co.Pos2.x - co.Pos1.x;
        let dy = co.Pos2.y - co.Pos1.y;
        len += Math.sqrt(dx*dx + dy*dy);
      }
    }
  }

  return len;
}

function process(panel) {
  if (!panel.Cuts || panel.Cuts.Count === 0) return;
  for (let i = 0; i < panel.Cuts.Count; i++) {
    let c = panel.Cuts[i];
    let l = getCutLen(c);
    totalLen += l;
    totalCuts++;
  }
}

// обход как раньше (всех или выбранных панелей)
if (Model.SelectionCount > 0) {
  for (let i = 0; i < Model.SelectionCount; i++) {
    let obj = Model.Selections[i];
    if (obj instanceof TFurnPanel) process(obj);
    else if (obj.AsList) searchList(obj);
  }
} else {
  Model.forEachPanel(p => process(p));
}
function searchList(list) {
  for (let i = 0; i < list.Count; i++) {
    let obj = list[i];
    if (obj instanceof TFurnPanel) process(obj);
    else if (obj.AsList) searchList(obj);
  }
}

if (totalCuts > 0) {
  alert(`Пазы: ${totalCuts}\nОбщая длина: ${totalLen.toFixed(2)} мм`);
} else {
  alert("Пазы (вырезы) не найдены.");
}
