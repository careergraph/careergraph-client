class TagColor {
  static colorMap = {
    java: {
      bg: "bg-red-400/10",
      text: "text-red-400",
      ring: "inset-ring inset-ring-red-400/20",
    },
    "c#": {
      bg: "bg-blue-400/10",
      text: "text-blue-400",
      ring: "inset-ring inset-ring-blue-400/20",
    },
    python: {
      bg: "bg-green-400/10",
      text: "text-green-400",
      ring: "inset-ring inset-ring-green-400/20",
    },
    javascript: {
      bg: "bg-yellow-400/10",
      text: "text-yellow-500",
      ring: "inset-ring inset-ring-yellow-400/20",
    },
    typescript: {
      bg: "bg-indigo-400/10",
      text: "text-indigo-400",
      ring: "inset-ring inset-ring-indigo-400/30",
    },
    react: {
      bg: "bg-cyan-400/10",
      text: "text-cyan-400",
      ring: "inset-ring inset-ring-cyan-400/30",
    },
    golang: {
      bg: "bg-green-500/10",
      text: "text-green-500",
      ring: "inset-ring inset-ring-green-500/30",
    },
    docker: {
      bg: "bg-sky-400/10",
      text: "text-sky-400",
      ring: "inset-ring inset-ring-sky-400/20",
    },
    kubernetes: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      ring: "inset-ring inset-ring-blue-500/30",
    },
    nodejs: {
      bg: "bg-lime-400/10",
      text: "text-lime-400",
      ring: "inset-ring inset-ring-lime-400/30",
    },
    graphql: {
      bg: "bg-pink-400/10",
      text: "text-pink-400",
      ring: "inset-ring inset-ring-pink-400/20",
    },
    default: {
      bg: "bg-gray-400/10",
      text: "text-gray-400",
      ring: "inset-ring inset-ring-gray-400/20",
    },
  };

  static getColor(label) {
    const key = label.toLowerCase();
    return this.colorMap[key] || this.colorMap.default;
  }
}

export default TagColor;
