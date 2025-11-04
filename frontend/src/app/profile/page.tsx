'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase/client';
import PreferencesForm from './components/PreferencesForm';
import ProfileForm from './components/ProfileForm';

interface Preferences {
    [key: string]: boolean | string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [preferences, setPreferences] = useState<Preferences>({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchPreferences = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_preferences')
                .select('preferences')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data && typeof data.preferences === 'object' && data.preferences !== null) {
                setPreferences(data.preferences);
            }
        } catch (error) {
            console.error('Error fetching preferences:', error);
        }
    }, []);

    const handlePreferenceChange = (key: string, value?: string) => {
        if (key === 'custom') {
            setPreferences(prev => ({ ...prev, [key]: value || '' }));
        } else {
            setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
        }
    };

    const preferenceCategories = {
        "目的地类型": {
            beach: '海滩',
            mountain: '山脉',
            city: '城市',
            countryside: '乡村',
        },
        "旅行主题": {
            adventure: '冒险',
            relaxation: '休闲',
            culture: '文化',
            history: '历史',
        },
        "旅行类型": {
            luxury: "奢华",
            budget: "经济",
            family_friendly: "家庭",
            backpacking: "背包客",
        },
        "兴趣点": {
            foodie: "美食",
            shopping: "购物",
            nightlife: "夜生活",
            art_museums: "艺术与博物馆",
            outdoor_sports: "户外运动",
        },
        "旅行节奏": {
            fast_paced: "快节奏",
            slow_paced: "慢节奏",
        },
        "其他": {
            custom: '自定义'
        }
    };

    const handleUpdateProfile = async (name: string) => {
        if (!user) return;
        try {
            const { data, error } = await supabase.auth.updateUser({
                data: { user_name: name }
            });

            if (error) throw error;

            setUser(data.user);
            alert("用户信息更新成功！");
        } catch (error) {
            console.error('Error updating profile:', error);
            alert("用户信息更新失败。");
        }
    };

    const handleUpdatePreferences = async () => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('user_preferences')
                .upsert({ user_id: user.id, preferences: preferences }, { onConflict: 'user_id' });

            if (error) throw error;

            alert("偏好更新成功！");
        } catch (error) {
            console.error('Error updating preferences:', error);
            alert("偏好更新失败。");
        }
    };

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                fetchPreferences(session.user.id);
            } else {
                router.push('/login');
            }
            setLoading(false);
        };
        getSession();
    }, [router, fetchPreferences]);

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">个人中心</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <ProfileForm user={user} onUpdate={handleUpdateProfile} />
                    </div>
                    <div className="lg:col-span-2">
                        <PreferencesForm
                            preferenceCategories={preferenceCategories}
                            preferences={preferences}
                            handlePreferenceChange={handlePreferenceChange}
                            handleUpdatePreferences={handleUpdatePreferences}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}