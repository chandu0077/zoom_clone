// "use client";
// import Loader from "@/components/Loader";
// import MeetingRoom from "@/components/MeetingRoom";
// import MeetingSetUp from "@/components/MeetingSetup";
// // import MeetingSetUp from "@/components/MeetingSetUp";
// import { useGetCallById } from "@/hooks/useGetCallById";
// import { useUser } from "@clerk/nextjs";
// import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
// import { useState } from "react";

// import { useParams } from "next/navigation";

// const Meeting = () => {
//   const { id } = useParams();
//   // const { isLoaded, user } = useUser();

//   const { user, isLoaded } = useUser();

//   const [isSetupComplete, setIsSetupComplete] = useState(false);

//   const { call, isCallLoading } = useGetCallById(id);

//   // const { id } = await params;

//   if (!isLoaded || isCallLoading) return <Loader />;

//   return (
//     <main className="h-screen w-full">
//       <StreamCall call={call}>
//         <StreamTheme>
//           {!isSetupComplete ? (
//             <MeetingSetUp setIsSetupComplete={setIsSetupComplete} />
//           ) : (
//             <MeetingRoom />
//           )}
//         </StreamTheme>
//       </StreamCall>
//     </main>
//   );
// };

// export default Meeting;

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";

import { useGetCallById } from "@/hooks/useGetCallById";
import Alert from "@/components/Alert";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";

const MeetingPage = () => {
  console.log("MEETING PAGE");
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id as string);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  console.log("isLoaded", isLoaded);
  console.log("user", user);
  console.log("isCallLoading", isCallLoading);

  if (!isLoaded || isCallLoading) return <Loader />;

  console.log("call", call);
  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

  // get more info about custom call type:  https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed =
    call.type === "invited" &&
    (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed)
    return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
