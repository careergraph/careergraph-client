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
    flexDirection: "row",
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#334155",
  },
  sidebar: {
    width: "35%",
    backgroundColor: "#2c1a1d",
    color: "#f8fafc",
    padding: 30,
    display: "flex",
    gap: 20,
  },
  sidebarHeading: {
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 10,
    textTransform: "uppercase",
    color: "#fca5a5",
    fontWeight: 700,
    borderBottom: "1 solid #7f1d1d",
    paddingBottom: 6,
  },
  sidebarLink: {
    color: "#f8fafc",
    textDecoration: "none",
    marginBottom: 6,
    fontSize: 9.5,
  },
  sidebarText: {
    marginBottom: 6,
    lineHeight: 1.6,
    fontSize: 9.5,
  },
  main: {
    width: "65%",
    padding: 40,
    display: "flex",
    gap: 24,
  },
  header: {
    borderBottom: "3 solid #991b1b",
    paddingBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 1,
    color: "#0f172a",
  },
  headline: {
    fontSize: 13,
    color: "#991b1b",
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: 500,
  },
  summary: {
    marginTop: 14,
    lineHeight: 1.8,
    fontSize: 10.5,
    color: "#475569",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: 700,
    color: "#991b1b",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  experienceItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 10,
  },
  experienceHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: 700,
    fontSize: 11,
    color: "#0f172a",
  },
  companyLine: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#4b5563",
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 10,
    lineHeight: 1.5,
    fontSize: 9,
  },
  educationItem: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    marginBottom: 6,
  },
  tag: {
    fontSize: 8,
    border: "1 solid #a51c30",
    color: "#a51c30",
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
});

const HarvardTemplate = ({ data }) => {
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

  const themeColor = personal?.themeColor || "#991b1b";
  const tagColor = personal?.themeColor || "#a51c30";

  const sectionOrder = layout?.sectionOrder || ["experience", "education", "skills", "languages", "awards"];

  const getSortedSections = (keys) => {
    return keys.sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));
  };

  const sidebarSections = getSortedSections(["skills", "languages", "awards"]);
  const mainSections = getSortedSections(["experience", "education"]);

  const renderSidebarSection = (key) => {
    switch (key) {
      case "skills":
        return safeSkills.length > 0 ? (
          <View key="skills">
            <Text style={styles.sidebarHeading}>Kỹ năng nổi bật</Text>
            {safeSkills.map((skill, index) => (
              <Text key={skill?.id || `skill-${index}`} style={styles.sidebarText}>
                • {skill?.name || skill}
              </Text>
            ))}
          </View>
        ) : null;
      case "languages":
        return safeLanguages.length > 0 ? (
          <View key="languages">
            <Text style={styles.sidebarHeading}>Ngôn ngữ</Text>
            {safeLanguages.map((lang, index) => (
              <Text key={lang?.id || `lang-${index}`} style={styles.sidebarText}>
                • {lang?.name || ""}
              </Text>
            ))}
          </View>
        ) : null;
      case "awards":
        return safeAwards.length > 0 ? (
          <View key="awards">
            <Text style={styles.sidebarHeading}>Giải thưởng</Text>
            {safeAwards.map((award, index) => (
              <View key={award?.id || `award-${index}`} style={{ marginBottom: 6 }}>
                <Text style={{ fontWeight: 700 }}>{award?.title || ""}</Text>
                <Text style={{ fontSize: 10 }}>{award?.issuer || ""}</Text>
                <Text style={{ fontSize: 10 }}>{award?.year || ""}</Text>
              </View>
            ))}
          </View>
        ) : null;
      default:
        return null;
    }
  };

  const renderMainSection = (key) => {
    switch (key) {
      case "experience":
        return safeExperience.length > 0 ? (
          <View style={styles.section} wrap key="experience">
            <Text style={[styles.sectionHeading, { color: themeColor }]}>Kinh nghiệm làm việc</Text>
            {safeExperience.map((item, index) => (
              <View key={item?.id || `exp-${index}`} style={styles.experienceItem} wrap>
                <View style={styles.experienceHeader}>
                  <Text>{item?.role || ""}</Text>
                  <Text>{formatTimeline(item?.startDate, item?.endDate)}</Text>
                </View>
                <View style={styles.companyLine}>
                  <Text>{item?.company || ""}</Text>
                  <Text>{item?.location || ""}</Text>
                </View>
                {Array.isArray(item?.bulletPoints) && item.bulletPoints.length ? (
                  <View style={styles.bulletList}>
                    {item.bulletPoints.map((bullet, bulletIndex) => (
                      <Text key={`${item?.id || index}-bullet-${bulletIndex}`}>• {bullet}</Text>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null;
      case "education":
        return safeEducation.length > 0 ? (
          <View style={styles.section} wrap key="education">
            <Text style={[styles.sectionHeading, { color: themeColor }]}>Học vấn</Text>
            {safeEducation.map((item, index) => (
              <View key={item?.id || `edu-${index}`} style={styles.educationItem}>
                <Text style={{ fontWeight: 700 }}>{item?.school || ""}</Text>
                <Text>{item?.degree || ""}</Text>
                <Text style={{ color: "#6b7280" }}>
                  {formatTimeline(item?.startDate, item?.endDate)}
                </Text>
              </View>
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
        <View style={styles.sidebar}>
          <View>
            <Text style={styles.sidebarHeading}>Liên hệ</Text>
            {contact?.phone ? (
              <Text style={styles.sidebarText}>{contact.phone}</Text>
            ) : null}
            {contact?.email ? (
              <Link style={styles.sidebarLink} src={`mailto:${contact.email}`}>
                {contact.email}
              </Link>
            ) : null}
            {contact?.website ? (
              <Link
                style={styles.sidebarLink}
                src={`https://${contact.website.replace(/^https?:\/\//, "")}`}
              >
                {contact.website}
              </Link>
            ) : null}
            {contact?.linkedin ? (
              <Link
                style={styles.sidebarLink}
                src={`https://${contact.linkedin.replace(/^https?:\/\//, "")}`}
              >
                {contact.linkedin}
              </Link>
            ) : null}
          </View>

          {sidebarSections.map((key) => renderSidebarSection(key))}
        </View>

        <View style={styles.main}>
          <View style={[styles.header, { borderBottomColor: themeColor }]}>
            <Text style={styles.name}>{personal?.fullName}</Text>
            <Text style={[styles.headline, { color: themeColor }]}>{personal?.headline}</Text>
            {personal?.summary ? (
              <Text style={styles.summary}>{personal.summary}</Text>
            ) : null}
          </View>

          {mainSections.map((key) => renderMainSection(key))}

          {personal?.location || contact?.email ? (
            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: themeColor }]}>Thông tin thêm</Text>
              <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                {personal?.location ? <Text style={[styles.tag, { borderColor: tagColor, color: tagColor }]}>{personal.location}</Text> : null}
                {contact?.email ? <Text style={[styles.tag, { borderColor: tagColor, color: tagColor }]}>{contact.email}</Text> : null}
              </View>
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
};

export default HarvardTemplate;
