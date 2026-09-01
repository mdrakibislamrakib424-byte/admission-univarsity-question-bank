import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rakib.admissionquestionbank',
  appName: 'প্রশ্নব্যাংক',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
