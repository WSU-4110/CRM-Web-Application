//profileGlobalData.ts
//Singleton design implementation
type ProfileDataType = {
    firstName: string;
    lastName: string;
    company: string;
    businessType: string;
    timezone: string;
    position: string;
};

class ProfileGlobalData {
    private static instance: ProfileGlobalData;
    private data: ProfileDataType;

    private constructor() {
        this.data = {
            firstName: '',
            lastName: '',
            company: '',
            businessType: '',
            timezone: '',
            position: ''
        };
    }
    public static getInstance(): ProfileGlobalData {
        if (!ProfileGlobalData.instance) {
            ProfileGlobalData.instance = new ProfileGlobalData();
        }
        return ProfileGlobalData.instance;
    }

    
    public getProfileData(): ProfileDataType {
        return this.data;
    }

    
    public setProfileData(key: keyof ProfileDataType, value: string): void {
        this.data[key] = value;
    }
}

export default ProfileGlobalData;

