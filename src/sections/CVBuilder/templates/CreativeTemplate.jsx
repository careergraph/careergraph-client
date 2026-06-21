import { Document, Page, Text, View, Link, StyleSheet, Font, Image } from "@react-pdf/renderer";

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
  },
  sidebar: {
    width: "35%",
    backgroundColor: "#111827",
    color: "#ffffff",
    padding: 35,
  },
  profileSection: {
    marginBottom: 24,
  },
  name: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 8,
    letterSpacing: 1,
  },
  headline: {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 14,
    color: "#ffe4e6",
  },
  sidebarSection: {
    marginBottom: 22,
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: "1.5 solid rgba(255,255,255,0.4)",
  },
  sidebarText: {
    fontSize: 9.5,
    lineHeight: 1.7,
    marginBottom: 6,
  },
  sidebarLink: {
    fontSize: 9.5,
    color: "#ffffff",
    textDecoration: "none",
    marginBottom: 6,
  },
  skillItem: {
    fontSize: 9.5,
    marginBottom: 8,
    paddingLeft: 8,
  },
  mainContent: {
    width: "65%",
    padding: 40,
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
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  experienceItem: {
    marginBottom: 18,
  },
  jobHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
  },
  timeline: {
    fontSize: 9.5,
    color: "#64748b",
    fontWeight: 500,
  },
  company: {
    fontSize: 9.5,
    color: "#EC4899",
    marginBottom: 6,
    fontWeight: 500,
  },
  bulletPoints: {
    paddingLeft: 10,
  },
  bullet: {
    fontSize: 9,
    lineHeight: 1.6,
    marginBottom: 3,
    color: "#4b5563",
  },
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#111827",
  },
  school: {
    fontSize: 9.5,
    color: "#6b7280",
    marginTop: 2,
  },
  awardItem: {
    marginBottom: 10,
  },
  awardTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#111827",
  },
  awardDetail: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 1,
  },
});

const CreativeTemplate = ({ data }) => {
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

  const themeColor = personal?.themeColor || "#111827";

  const sectionOrder = layout?.sectionOrder || ["experience", "education", "skills", "languages", "awards"];

  const getSortedSections = (keys) => {
    return keys.sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));
  };

  const sidebarSections = getSortedSections(["skills", "languages"]);
  const mainSections = getSortedSections(["experience", "education", "awards"]);

  const renderSidebarSection = (key) => {
    switch (key) {
      case "skills":
        return safeSkills.length > 0 ? (
          <View style={styles.sidebarSection} key="skills">
            <Text style={styles.sidebarTitle}>Kỹ năng</Text>
            {safeSkills.map((skill, index) => (
              <Text key={skill?.id || `skill-${index}`} style={styles.skillItem}>
                ◆ {skill?.name || skill}
              </Text>
            ))}
          </View>
        ) : null;
      case "languages":
        return safeLanguages.length > 0 ? (
          <View style={styles.sidebarSection} key="languages">
            <Text style={styles.sidebarTitle}>Ngôn ngữ</Text>
            {safeLanguages.map((lang, index) => (
              <Text key={lang?.id || `lang-${index}`} style={styles.skillItem}>
                ◆ {lang?.name || ""}
              </Text>
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
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Kinh nghiệm</Text>
            {safeExperience.map((item, index) => (
              <View key={item?.id || `exp-${index}`} style={styles.experienceItem}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{item?.role || ""}</Text>
                  <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
                </View>
                <Text style={styles.company}>{item?.company || ""}</Text>
                {Array.isArray(item?.bulletPoints) && item.bulletPoints.length > 0 && (
                  <View style={styles.bulletPoints}>
                    {item.bulletPoints.map((bullet, idx) => (
                      <Text key={`${item?.id || index}-bullet-${idx}`} style={styles.bullet}>
                        ▸ {bullet}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : null;
      case "education":
        return safeEducation.length > 0 ? (
          <View style={styles.section} wrap key="education">
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Học vấn</Text>
            {safeEducation.map((item, index) => (
              <View key={item?.id || `edu-${index}`} style={styles.educationItem}>
                <Text style={styles.degree}>{item?.degree || ""}</Text>
                <Text style={styles.school}>{item?.school || ""}</Text>
                <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
              </View>
            ))}
          </View>
        ) : null;
      case "awards":
        return safeAwards.length > 0 ? (
          <View style={styles.section} key="awards">
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Giải thưởng</Text>
            {safeAwards.map((award, index) => (
              <View key={award?.id || `award-${index}`} style={styles.awardItem}>
                <Text style={styles.awardTitle}>{award?.title || ""}</Text>
                <Text style={styles.awardDetail}>{award?.issuer || ""} • {award?.year || ""}</Text>
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
        {/* Sidebar */}
        <View style={[styles.sidebar, { backgroundColor: themeColor }]}>
          <View style={styles.profileSection}>
            {personal?.avatar && (
              <Image src={personal.avatar} style={{ width: 80, height: 80, borderRadius: 40, objectFit: "cover", marginBottom: 16, border: "3 solid rgba(255,255,255,0.2)" }} />
            )}
            <Text style={styles.name}>{personal?.fullName}</Text>
            <Text style={styles.headline}>{personal?.headline}</Text>
          </View>

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Liên hệ</Text>
            {contact?.phone && <Text style={styles.sidebarText}>{contact.phone}</Text>}
            {contact?.email && (
              <Link style={styles.sidebarLink} src={`mailto:${contact.email}`}>
                {contact.email}
              </Link>
            )}
            {contact?.website && (
              <Link style={styles.sidebarLink} src={`https://${contact.website.replace(/^https?:\/\//, "")}`}>
                {contact.website}
              </Link>
            )}
            {personal?.location && <Text style={styles.sidebarText}>{personal.location}</Text>}
          </View>

          {sidebarSections.map((key) => renderSidebarSection(key))}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Summary */}
          {personal?.summary && <Text style={styles.summary}>"{personal.summary}"</Text>}

          {mainSections.map((key) => renderMainSection(key))}
        </View>
      </Page>
    </Document>
  );
};

export default CreativeTemplate;
