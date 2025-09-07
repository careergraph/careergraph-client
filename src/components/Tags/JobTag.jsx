import React from "react";
import TagColor from "../../data/tagColor";

function JobTag({ label }) {
  const color = TagColor.getColor(label);

  return (
    <button
      className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ${color.bg} ${color.text} ${color.ring}`}
    >
      {label}
    </button>
  );
}

export default JobTag;
