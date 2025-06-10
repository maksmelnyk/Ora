import React from "react";
import {
  Globe,
  Facebook,
  Linkedin,
  Youtube,
  Star,
  Bookmark,
} from "lucide-react";
import { formatCounter } from "@/common/utils";
import { Avatar, Button } from "@/common/components";
import { ProfileDetailsResponse } from "../types";

interface ProfileHeaderProps {
  user: ProfileDetailsResponse;
  isOwnProfile: boolean;
  onMessage?: () => void;
  onFollow?: () => void;
  onBookmark?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile,
  onMessage,
  onFollow,
  onBookmark,
}) => {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex w-full max-w-[40%]">
        <div className="flex flex-col justify-between items-center">
          <Avatar
            src={user.imageUrl || undefined}
            name={fullName}
            size="xl"
            className="w-30 h-30 lg:w-40 lg:h-40"
          />
          <div className="flex justify-center mt-2 gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Globe className="w-4 h-4 text-ora-gray" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Facebook className="w-4 h-4 text-ora-gray" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Linkedin className="w-4 h-4 text-ora-gray" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Youtube className="w-4 h-4 text-ora-gray" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 pl-8">
          <div>
            <h1 className="ora-subheading text-2xl">{fullName}</h1>
            <p className="ora-body text-sm text-ora-gray">@{user.username}</p>
            {user.bio && (
              <p className="ora-body text-sm text-ora-gray mt-2">{user.bio}</p>
            )}
          </div>

          {user.educator && (
            <div className="flex items-center justify-start gap-4">
              <div className="flex-1 text-center pr-1">
                <div className="flex justify-center items-center gap-1 mb-1">
                  <Star className="w-4.5 h-4.5 fill-current text-ora-navy" />
                  <span className="ora-heading text-lg text-ora-navy">
                    {user.educator.rating || 4.9}
                  </span>
                </div>
                <div className="ora-body text-xs text-ora-gray">rating</div>
              </div>

              <div className="h-6 w-px bg-gray-400" />

              <div className="flex-1 text-center px-1">
                <div className="ora-heading text-lg text-ora-navy mb-1">
                  {formatCounter(user.educator.studentCount)}
                </div>
                <div className="ora-body text-xs text-ora-gray">students</div>
              </div>

              <div className="h-6 w-px bg-gray-400" />

              <div className="flex-1 text-center pl-1">
                <div className="ora-heading text-lg text-ora-navy mb-1">
                  {formatCounter(user.educator.productCount)}
                </div>
                <div className="ora-body text-xs text-ora-gray">courses</div>
              </div>
            </div>
          )}

          {!isOwnProfile && (
            <div className="flex justify-items-stretch gap-3">
              <Button
                className="flex-1"
                size="sm"
                variant="secondary"
                onClick={onMessage}
              >
                Message Me
              </Button>
              <Button
                className="flex-1"
                size="sm"
                variant="teal"
                onClick={onFollow}
              >
                Follow
              </Button>
            </div>
          )}
        </div>
      </div>

      {!isOwnProfile && (
        <div>
          <Button
            variant="ghost"
            size="lg"
            onClick={onBookmark}
            className="text-ora-navy"
          >
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
