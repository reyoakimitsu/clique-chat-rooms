
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Settings saved!",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="container max-w-3xl py-10 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <Card className="border-clique-purple/20">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-notifications" className="font-medium">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for messages and activity</p>
              </div>
              <Switch id="enable-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-notifications" className="font-medium">Sound Notifications</Label>
                <p className="text-sm text-muted-foreground">Play a sound when receiving new messages</p>
              </div>
              <Switch id="sound-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="group-notifications" className="font-medium">Group Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about group activities</p>
              </div>
              <Switch id="group-notifications" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-clique-purple/20">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact-mode" className="font-medium">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Display more content with less spacing</p>
              </div>
              <Switch id="compact-mode" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animate-transitions" className="font-medium">Animate Transitions</Label>
                <p className="text-sm text-muted-foreground">Enable smooth animations between pages</p>
              </div>
              <Switch id="animate-transitions" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-clique-purple/20">
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="online-status" className="font-medium">Show Online Status</Label>
                <p className="text-sm text-muted-foreground">Let others see when you're online</p>
              </div>
              <Switch id="online-status" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="read-receipts" className="font-medium">Read Receipts</Label>
                <p className="text-sm text-muted-foreground">Let others know when you've read their messages</p>
              </div>
              <Switch id="read-receipts" defaultChecked />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Reset Defaults</Button>
            <Button className="bg-clique-purple hover:bg-clique-purple/90" onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
