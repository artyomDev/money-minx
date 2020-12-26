import { getCurrentSettings } from 'api/request.api';
import useFetch from 'common/hooks/useFetch';
import { SettingType } from 'setting/setting.type';

const useSettings = () => {
  const { res, loading } = useFetch(getCurrentSettings, {});

  return { loading, data: res?.data as SettingType, error: res?.error };
};

export default useSettings;
