"use client";

import { useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { Card, Button, Input, Textarea, Skeleton } from "@/components/ui";
import { useSellerTeams } from "@/lib/api/hooks";
import { Save, Upload } from "lucide-react";

export default function TeamSettingsGeneralPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const { data: teams, isLoading } = useSellerTeams();
  
  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  const [teamName, setTeamName] = useState(currentTeam?.name || "");
  const [teamDescription, setTeamDescription] = useState(currentTeam?.description || "");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    alert("บันทึกการตั้งค่าเรียบร้อย!");
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Basic Info */}
      <Card variant="elevated" className="border-none shadow-md">
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-dark">ชื่อทีม *</label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="ใส่ชื่อทีม"
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-dark">คำอธิบายทีม</label>
            <Textarea
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              placeholder="อธิบายทีมของคุณ..."
              rows={4}
              className="bg-white"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-dark">รูปปก</label>
            <div className="space-y-3">
              <div 
                onClick={handleCoverClick}
                className="h-32 bg-gradient-to-br from-brand-primary via-brand-accent to-amber-400 rounded-xl relative overflow-hidden shadow-md cursor-pointer group hover:shadow-lg transition-all"
              >
                {/* Cover Image or Gradient */}
                {coverImage ? (
                  <img 
                    src={coverImage} 
                    alt="Team Cover" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }} />
                    </div>
                  </>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Upload className="w-4 h-4" />
                    คลิกเพื่อเปลี่ยนรูปปก
                  </div>
                </div>
              </div>
              <p className="text-xs text-brand-text-light">แนะนำ: รูปแนวนอน 1200x400px ขนาดไม่เกิน 3MB</p>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          </div>

          {/* Avatar Upload Placeholder */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-dark">รูปโปรไฟล์ทีม</label>
            <div className="flex items-center gap-6">
              <div 
                onClick={handleAvatarClick}
                className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg cursor-pointer group hover:shadow-xl transition-all relative overflow-hidden"
              >
                {avatarImage ? (
                  <img 
                    src={avatarImage} 
                    alt="Team Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{(teamName || currentTeam?.name || "T").charAt(0)}</span>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAvatarClick}
                >
                  เปลี่ยนรูป
                </Button>
                <p className="text-xs text-brand-text-light mt-2">แนะนำ: รูปสี่เหลี่ยมจตุรัส ขนาดไม่เกิน 2MB</p>
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </div>
  );
}
