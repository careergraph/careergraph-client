import { useAuthStore } from "~/stores/authStore";


function AvatarUser({size="40", fontSize="sm"}) {
  const {user} = useAuthStore();
  return (  
    <div className={`w-${size} h-${size} rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-${fontSize}`}>
        {user?.firstName
          ? user.firstName.charAt(0).toUpperCase()
        : "U"}
      </div>
  );
}

export default AvatarUser;