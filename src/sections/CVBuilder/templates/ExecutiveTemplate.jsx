import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#334155",
    padding: 40,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderBottom: "3 solid #1e3a8a",
    paddingBottom: 24,
    marginBottom: 30,
  },
  name: {
    fontSize: 30,
    fontWeight: 700,
    color: "#1e3a8a",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  headline: {
    fontSize: 13,
    color: "#475569",
    letterSpacing: 1,
    marginBottom: 16,
  },
  contactRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 20,
    fontSize: 10,
    color: "#64748b",
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.8,
    color: "#1e293b",
    marginBottom: 32,
    textAlign: "justify",
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1e3a8a",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 16,
    textAlign: "center",
  },
  experienceItem: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  jobHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    borderBottom: "1 solid #e2e8f0",
    paddingBottom: 4,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
  },
  timeline: {
    fontSize: 10,
    color: "#1e3a8a",
    fontWeight: 500,
  },
  company: {
    fontSize: 11,
    color: "#475569",
    fontWeight: 700,
    marginBottom: 8,
  },
  bulletPoints: {
    paddingLeft: 14,
  },
  bullet: {
    fontSize: 10.5,
    lineHeight: 1.7,
    color: "#334155",
    marginBottom: 4,
  },
  twoColumns: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
    paddingHorizontal: 10,
  },
  column: {
    flex: 1,
  },
  educationItem: {
    marginBottom: 14,
  },
  degree: {
    fontSize: 11,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 4,
  },
  school: {
    fontSize: 10,
    color: "#475569",
  },
  skillRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillBadge: {
    fontSize: 10,
    color: "#1e3a8a",
    backgroundColor: "#eff6ff",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  awardItem: {
    marginBottom: 10,
  },
  awardTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#0f172a",
  },
  awardDetail: {
    fontSize: 9,
    color: "#64748b",
  },
});

const ExecutiveTemplate = ({ data }) => {
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

  const themeColor = personal?.themeColor || "#1e3a8a";
  const sectionOrder = layout?.sectionOrder || ["experience", "education", "skills", "languages", "awards"];

  const getSortedSections = (keys) => {
    return keys.sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));
  };

  const mainSections = getSortedSections(["experience"]);
  const leftColSections = getSortedSections(["education", "languages"]);
  const rightColSections = getSortedSections(["skills", "awards"]);

  const renderMainSection = (key) => {
    switch (key) {
      case "experience":
        return safeExperience.length > 0 ? (
          <View style={styles.section} key="experience" wrap>
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Kinh Nghiệm Điều Hành</Text>
            {safeExperience.map((item, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{item?.role}</Text>
                  <Text style={[styles.timeline, { color: themeColor }]}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
                </View>
                <Text style={styles.company}>{item?.company}</Text>
                {item?.bulletPoints && item.bulletPoints.length > 0 && (
                  <View style={styles.bulletPoints}>
                    {item.bulletPoints.map((bullet, idx) => (
                      <Text key={idx} style={styles.bullet}>• {bullet}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : null;
      default:
        return null;
    }
  };

  const renderLeftSection = (key) => {
    switch (key) {
      case "education":
        return safeEducation.length > 0 ? (
          <View style={styles.section} key="education" wrap>
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Học vấn</Text>
            {safeEducation.map((item, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.degree}>{item?.degree}</Text>
                <Text style={styles.school}>{item?.school}</Text>
                <Text style={[styles.timeline, { color: themeColor }]}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
              </View>
            ))}
          </View>
        ) : null;
      case "languages":
        return safeLanguages.length > 0 ? (
          <View style={styles.section} key="languages">
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Ngôn ngữ</Text>
            <View style={styles.skillRow}>
              {safeLanguages.map((lang, index) => (
                 <Text key={index} style={[styles.skillBadge, { color: themeColor, backgroundColor: `${themeColor}15` }]}>{lang?.name || ""}</Text>
              ))}
            </View>
          </View>
        ) : null;
      default:
        return null;
    }
  };

  const renderRightSection = (key) => {
    switch (key) {
      case "skills":
        return safeSkills.length > 0 ? (
          <View style={styles.section} key="skills">
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Năng lực cốt lõi</Text>
            <View style={styles.skillRow}>
              {safeSkills.map((skill, index) => (
                 <Text key={index} style={[styles.skillBadge, { color: themeColor, backgroundColor: `${themeColor}15` }]}>{skill?.name || skill}</Text>
              ))}
            </View>
          </View>
        ) : null;
      case "awards":
        return safeAwards.length > 0 ? (
          <View style={styles.section} key="awards">
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Giải thưởng</Text>
            {safeAwards.map((award, index) => (
              <View key={index} style={styles.awardItem}>
                <Text style={styles.awardTitle}>{award?.title}</Text>
                <Text style={styles.awardDetail}>{award?.issuer} • {award?.year}</Text>
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
      <Page size="A4" style={styles.page}>
        <View style={[styles.header, { borderBottomColor: themeColor }]}>
          {personal?.avatar && (
            <Image src={personal.avatar} style={{ width: 80, height: 80, borderRadius: 40, objectFit: "cover", marginBottom: 16 }} />
          )}
          <Text style={[styles.name, { color: themeColor }]}>{personal?.fullName}</Text>
          <Text style={styles.headline}>{personal?.headline}</Text>
          <View style={styles.contactRow}>
            {contact?.phone && <Text>{contact.phone}</Text>}
            {contact?.email && <Text>{contact.email}</Text>}
            {personal?.location && <Text>{personal.location}</Text>}
          </View>
        </View>

        {personal?.summary && (
          <Text style={styles.summary}>{personal.summary}</Text>
        )}

        {mainSections.map((key) => renderMainSection(key))}

        <View style={styles.twoColumns}>
          <View style={styles.column}>
            {leftColSections.map((key) => renderLeftSection(key))}
          </View>

          <View style={styles.column}>
            {rightColSections.map((key) => renderRightSection(key))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ExecutiveTemplate;
