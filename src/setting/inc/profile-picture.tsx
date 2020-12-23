import React, { useRef, useState } from 'react';

import useToast from 'common/hooks/useToast';
import { fetchProfile } from 'auth/auth.service';
import MMToolTip from 'common/components/tooltip';
import { useAuthDispatch } from 'auth/auth.context';
import { patchProfilePicture } from 'api/request.api';
import ImageInput from 'common/components/input/image.input';
import ProfileDefaultPic from 'assets/images/settings/mm-default-avatar.svg';

interface ProfilePictureProps {
  pictureURL?: string;
}
const ProfilePicture: React.FC<ProfilePictureProps> = ({ pictureURL }) => {
  const ppRef = useRef(null);
  const { mmToast } = useToast();
  const dispatch = useAuthDispatch();
  const [profileURL, setProfileURL] = useState<string>(pictureURL || ProfileDefaultPic);
  const [profilePicture, setProfilePicture] = useState<File>();
  const [profileChanged, setProfileChanged] = useState<boolean>(false);
  const [changing, setChanging] = useState<boolean>(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 0) {
      const file = e.target.files?.[e.target.files.length - 1];
      if (file) {
        setProfilePicture(file);
        const url = URL.createObjectURL(file);
        setProfileURL(url);
        setProfileChanged(true);
      }
    }
  };

  const handleFileBrowserOpen = (pictureRef: any) => {
    pictureRef.current?.click();
  };

  const handleProfileChange = async () => {
    if (profilePicture) {
      setChanging(true);
      const formData = new FormData();
      formData.append('file', profilePicture);
      const { error } = await patchProfilePicture(formData);
      if (error) {
        mmToast('Error on uploading picture', { type: 'error' });
      }

      const result = await fetchProfile({ dispatch });
      if (result.error) {
        mmToast('Error on changing picture', { type: 'error' });
      }
      setProfileChanged(false);
      setChanging(false);
    }
  };

  return (
    <div className='card mm-setting-card'>
      <div className='card-body'>
        <div className='mm-profile-overview__title'>Profile Picture</div>
        <div className='d-sm-flex justify-content-between align-items-center'>
          <div className='mm-profile-overview__title-pp' onClick={() => handleFileBrowserOpen(ppRef)} role='button'>
            <img
              alt='Money Minx Investor'
              src={profileURL}
              className='rounded-circle mr-2 profile-pic-large'
              width='100'
              height='100'
            />
          </div>
          <div className='mm-profile-pic-help text--grayText'>Square images work best <br />(e.g. 300 x 300)</div>
          <div className='mt-4 mt-sm-0'>
            <button
              type='button'
              className='btn btn-outline-primary mm-button btn-lg'
              onClick={handleProfileChange}
              disabled={!profileChanged}
            >
              {changing && <span className='spinner-grow spinner-grow-sm' role='status' aria-hidden='true' />}
              <MMToolTip placement='top' message='To change your profile pic, click on the current image on the left.'>
                <span className={'ml-1'}> {changing ? 'Saving...' : 'Save Picture'}</span>
              </MMToolTip>
            </button>
          </div>
        </div>
      </div>
      <ImageInput handleChange={handleChange} imageRef={ppRef} />
    </div>
  );
};

export default ProfilePicture;
