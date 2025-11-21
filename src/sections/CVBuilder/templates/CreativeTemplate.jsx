import { Document, Page, Text, View, Link, StyleSheet, Font } from "@react-pdf/renderer";

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
    width: "38%",
    backgroundColor: "#EC4899",
    color: "#ffffff",
    padding: 28,
  },
  profileSection: {
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 11,
    fontWeight: 300,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  sidebarSection: {
    marginBottom: 18,
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: "1.5 solid rgba(255,255,255,0.4)",
  },
  sidebarText: {
    fontSize: 9,
    lineHeight: 1.6,
    marginBottom: 5,
  },
  sidebarLink: {
    fontSize: 9,
    color: "#ffffff",
    textDecoration: "none",
    marginBottom: 5,
  },
  skillItem: {
    fontSize: 9,
    marginBottom: 6,
    paddingLeft: 8,
  },
  mainContent: {
    width: "62%",
    padding: 32,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.7,
    color: "#374151",
    marginBottom: 24,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#EC4899",
    marginBottom: 14,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  experienceItem: {
    marginBottom: 16,
  },
  jobHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
  },
  timeline: {
    fontSize: 8.5,
    color: "#6b7280",
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <View style={styles.profileSection}>
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

          {/* Skills */}
          {safeSkills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Kỹ năng</Text>
              {safeSkills.map((skill, index) => (
                <Text key={skill?.id || `skill-${index}`} style={styles.skillItem}>
                  ◆ {skill?.name || skill}
                </Text>
              ))}
            </View>
          )}

          {/* Languages */}
          {safeLanguages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Ngôn ngữ</Text>
              {safeLanguages.map((lang, index) => (
                <Text key={lang?.id || `lang-${index}`} style={styles.skillItem}>
                  ◆ {lang?.name || ""}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Summary */}
          {personal?.summary && <Text style={styles.summary}>"{personal.summary}"</Text>}

          {/* Experience */}
          {safeExperience.length > 0 && (
            <View style={styles.section} wrap>
              <Text style={styles.sectionTitle}>Kinh nghiệm</Text>
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
          )}

          {/* Education */}
          {safeEducation.length > 0 && (
            <View style={styles.section} wrap>
              <Text style={styles.sectionTitle}>Học vấn</Text>
              {safeEducation.map((item, index) => (
                <View key={item?.id || `edu-${index}`} style={styles.educationItem}>
                  <Text style={styles.degree}>{item?.degree || ""}</Text>
                  <Text style={styles.school}>{item?.school || ""}</Text>
                  <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Awards */}
          {safeAwards.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Giải thưởng</Text>
              {safeAwards.map((award, index) => (
                <View key={award?.id || `award-${index}`} style={styles.awardItem}>
                  <Text style={styles.awardTitle}>{award?.title || ""}</Text>
                  <Text style={styles.awardDetail}>{award?.issuer || ""} • {award?.year || ""}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default CreativeTemplate;
