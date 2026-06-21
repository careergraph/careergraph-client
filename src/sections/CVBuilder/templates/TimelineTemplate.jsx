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
    borderBottom: "1 solid #e2e8f0",
    paddingBottom: 20,
    marginBottom: 24,
  },
  name: {
    fontSize: 32,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 8,
  },
  headline: {
    fontSize: 13,
    color: "#d97706",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  contactRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    fontSize: 9.5,
    color: "#64748b",
  },
  summary: {
    fontSize: 10.5,
    lineHeight: 1.8,
    color: "#475569",
    marginBottom: 28,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#d97706",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 16,
  },
  timelineContainer: {
    borderLeft: "2 solid #fde68a",
    paddingLeft: 20,
    marginLeft: 8,
  },
  experienceItem: {
    marginBottom: 20,
    position: "relative",
  },
  timelineDot: {
    position: "absolute",
    left: -26,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#d97706",
    border: "2 solid #fff",
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 4,
  },
  companyLine: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  company: {
    fontSize: 10.5,
    color: "#475569",
    fontWeight: 700,
  },
  timeline: {
    fontSize: 9.5,
    color: "#94a3b8",
  },
  bulletPoints: {
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#475569",
    marginBottom: 4,
  },
  twoColumns: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
  },
  column: {
    flex: 1,
  },
  skillBadge: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 9.5,
    marginBottom: 8,
    marginRight: 8,
  },
  skillsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
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
    marginBottom: 2,
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
    marginTop: 1,
  },
});

const TimelineTemplate = ({ data }) => {
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

  const themeColor = personal?.themeColor || "#d97706";
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
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Kinh nghiệm</Text>
            <View style={[styles.timelineContainer, { borderLeft: `2 solid ${themeColor}60` }]}>
              {safeExperience.map((item, index) => (
                <View key={index} style={styles.experienceItem} wrap>
                  <View style={[styles.timelineDot, { backgroundColor: themeColor }]} />
                  <Text style={styles.jobTitle}>{item?.role}</Text>
                  <View style={styles.companyLine}>
                    <Text style={styles.company}>{item?.company}</Text>
                    <Text style={styles.timeline}>• {formatTimeline(item?.startDate, item?.endDate)}</Text>
                  </View>
                  {item?.bulletPoints && item.bulletPoints.length > 0 && (
                    <View style={styles.bulletPoints}>
                      {item.bulletPoints.map((bullet, idx) => (
                        <Text key={idx} style={styles.bullet}>- {bullet}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
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
                <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
              </View>
            ))}
          </View>
        ) : null;
      case "languages":
        return safeLanguages.length > 0 ? (
          <View style={styles.section} key="languages">
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Ngôn ngữ</Text>
            <View style={styles.skillsContainer}>
              {safeLanguages.map((lang, index) => (
                <Text key={index} style={[styles.skillBadge, { color: themeColor, backgroundColor: `${themeColor}20` }]}>{lang?.name || ""}</Text>
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
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Kỹ năng</Text>
            <View style={styles.skillsContainer}>
              {safeSkills.map((skill, index) => (
                 <Text key={index} style={[styles.skillBadge, { color: themeColor, backgroundColor: `${themeColor}20` }]}>{skill?.name || skill}</Text>
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
        <View style={[styles.header, { display: "flex", flexDirection: "row", alignItems: "center", gap: 24, borderBottom: `2 solid ${themeColor}` }]}>
          {personal?.avatar && (
            <Image src={personal.avatar} style={{ width: 80, height: 80, borderRadius: 40, objectFit: "cover", border: `2 solid ${themeColor}` }} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{personal?.fullName}</Text>
            <Text style={[styles.headline, { color: themeColor }]}>{personal?.headline}</Text>
            <View style={styles.contactRow}>
              {contact?.phone && <Text>{contact.phone}</Text>}
              {contact?.email && <Text>{contact.email}</Text>}
              {personal?.location && <Text>{personal.location}</Text>}
            </View>
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

export default TimelineTemplate;
