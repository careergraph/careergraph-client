import { Document, Page, Text, View, Link, StyleSheet, Font } from "@react-pdf/renderer";

// Register Vietnamese-compatible font
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#334155",
    padding: 40,
    paddingTop: 50,
  },
  header: {
    borderBottom: "1 solid #e2e8f0",
    paddingBottom: 20,
    marginBottom: 24,
  },
  name: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: 1,
    color: "#0f172a",
  },
  headline: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 6,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: 400,
  },
  summary: {
    marginTop: 14,
    lineHeight: 1.8,
    fontSize: 10.5,
    color: "#475569",
  },
  infoRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 14,
    fontSize: 9.5,
    color: "#64748b",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
    color: "#0f172a",
  },
  timeline: {
    color: "#94a3b8",
    fontSize: 9,
    marginTop: 2,
  },
  experienceItem: {
    marginBottom: 14,
  },
  bullet: {
    marginLeft: 10,
    lineHeight: 1.7,
    fontSize: 10,
    color: "#475569",
    marginTop: 3,
  },
  columns: {
    display: "flex",
    flexDirection: "row",
    gap: 28,
  },
  column: {
    flex: 1,
  },
  pill: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#f1f5f9",
    color: "#334155",
    fontSize: 9.5,
    marginRight: 6,
    marginBottom: 6,
  },
});

const MinimalTemplate = ({ data }) => {
  const {
    personal = {},
    contact = {},
    experience = [],
    education = [],
    skills = [],
    languages = [],
    awards = [],
    layout = {},
  } = data || {};

  // Ensure arrays are valid
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeLanguages = Array.isArray(languages) ? languages : [];
  const safeAwards = Array.isArray(awards) ? awards : [];
  const safeExperience = Array.isArray(experience) ? experience : [];
  const safeEducation = Array.isArray(education) ? education : [];

  const formatTimeline = (start, end) => {
    if (!start && !end) return "";
    if (start && !end) return `${start} - Hiện tại`;
    return `${start || ""} - ${end || ""}`.trim();
  };

  const themeColor = personal?.themeColor || "#3b82f6";
  const sectionOrder = layout?.sectionOrder || ["experience", "education", "skills", "languages", "awards"];

  const getSortedSections = (keys) => {
    return keys.sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));
  };

  const leftColSections = getSortedSections(["education", "awards"]);
  const rightColSections = getSortedSections(["skills", "languages"]);

  const renderSection = (key) => {
    switch (key) {
      case "experience":
        return safeExperience.length > 0 ? (
          <View style={styles.section} wrap key="experience">
            <Text style={styles.sectionTitle}>Kinh nghiệm</Text>
            {safeExperience.map((item, index) => (
              <View key={item?.id || `exp-${index}`} style={styles.experienceItem} wrap>
                <Text style={{ fontWeight: 700 }}>{item?.role || ""}</Text>
                <Text>{item?.company || ""}</Text>
                <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
                {Array.isArray(item?.bulletPoints) && item.bulletPoints.length ? (
                  <View>
                    {item.bulletPoints.map((bullet, bulletIndex) => (
                      <Text key={`${item?.id || index}-bullet-${bulletIndex}`} style={styles.bullet}>
                        • {bullet}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null;
      case "education":
        return safeEducation.length > 0 ? (
          <View style={styles.section} key="education">
            <Text style={styles.sectionTitle}>Học vấn</Text>
            {safeEducation.map((item, index) => (
              <View key={item?.id || `edu-${index}`} style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 700 }}>{item?.school || ""}</Text>
                <Text>{item?.degree || ""}</Text>
                <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
              </View>
            ))}
          </View>
        ) : null;
      case "awards":
        return safeAwards.length > 0 ? (
          <View style={styles.section} key="awards">
            <Text style={styles.sectionTitle}>Giải thưởng</Text>
            {safeAwards.map((award, index) => (
              <View key={award?.id || `award-${index}`} style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 700 }}>{award?.title || ""}</Text>
                <Text>{award?.issuer || ""}</Text>
                <Text style={styles.timeline}>{award?.year || ""}</Text>
              </View>
            ))}
          </View>
        ) : null;
      case "skills":
        return safeSkills.length > 0 ? (
          <View style={styles.section} key="skills">
            <Text style={styles.sectionTitle}>Kỹ năng</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {safeSkills.map((skill, index) => (
                <Text key={skill?.id || `skill-${index}`} style={styles.pill}>
                  {skill?.name || skill}
                </Text>
              ))}
            </View>
          </View>
        ) : null;
      case "languages":
        return safeLanguages.length > 0 ? (
          <View style={styles.section} key="languages">
            <Text style={styles.sectionTitle}>Ngôn ngữ</Text>
            {safeLanguages.map((lang, index) => (
              <Text key={lang?.id || `lang-${index}`} style={{ marginBottom: 6 }}>
                {lang?.name || ""}
              </Text>
            ))}
          </View>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>{personal?.fullName}</Text>
          <Text style={styles.headline}>{personal?.headline}</Text>
          {personal?.summary ? (
            <Text style={styles.summary}>{personal.summary}</Text>
          ) : null}

          <View style={styles.infoRow}>
            {contact?.email ? (
              <Link style={[styles.link, { color: themeColor }]} src={`mailto:${contact.email}`}>
                {contact.email}
              </Link>
            ) : null}
            {contact?.phone ? <Text>{contact.phone}</Text> : null}
            {contact?.website ? (
              <Link style={[styles.link, { color: themeColor }]} src={`https://${contact.website.replace(/^https?:\/\//, "")}`}>
                {contact.website}
              </Link>
            ) : null}
            {contact?.linkedin ? (
              <Link style={[styles.link, { color: themeColor }]} src={`https://${contact.linkedin.replace(/^https?:\/\//, "")}`}>
                {contact.linkedin}
              </Link>
            ) : null}
          </View>
        </View>

        {renderSection("experience")}

        <View style={styles.columns}>
          <View style={styles.column}>
            {leftColSections.map((key) => renderSection(key))}
          </View>

          <View style={styles.column}>
            {rightColSections.map((key) => renderSection(key))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MinimalTemplate;
