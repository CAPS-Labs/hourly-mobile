import { View, Text } from "react-native";

export default function OrganizationsScreen() {

    // The following const are temps for testing functionality

    const userRole = "admin"; // or "member"

    const organization = {
        name: "Helping Hands",
        slogan: "Serving the community together",
        totalHours: 1240,
        memberCount: 32,
    };

    const myHours = 42;


    return (
        <View>

            <Text>{organization.name}</Text>
            <Text>{organization.slogan}</Text>
            <Text>Total Hours: {organization.totalHours}</Text>
            <Text>Members: {organization.memberCount}</Text>

            <Text>My Hours: {myHours}</Text>

            {userRole === "admin" && (
                <View>
                    <Text>ADMIN PANEL</Text>
                    <Text>Edit Organization</Text>
                    <Text>Manage Members</Text>
                    <Text>Set Quota</Text>
                </View>
            )}

        </View>
        
    );
}