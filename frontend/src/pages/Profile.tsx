import { useState } from "react";
import { ArrowLeft, Camera, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";


const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        joined: "March 2023",
        bio: "Product designer passionate about creating beautiful and functional user experiences. Love working with cross-functional teams to build amazing products.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        status: "online"
    });

    const [editForm, setEditForm] = useState(profile);

    const handleSave = () => {
        setProfile(editForm);
        setIsEditing(false);

    };

    const handleCancel = () => {
        setEditForm(profile);
        setIsEditing(false);
    };

    const stats = [
        { label: "Messages Sent", value: "2,847" },
        { label: "Groups Joined", value: "12" },
        { label: "Files Shared", value: "156" },
        { label: "Active Days", value: "89" }
    ];

    return (
        <div className="min-h-screen bg-gradient-bg">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/chat')}
                            className="h-9 w-9 p-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-xl font-semibold">Profile Settings</h1>
                    </div>

                    {!isEditing ? (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                className="border-border"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="bg-card border-border">
                            <CardContent className="p-6 text-center">
                                <div className="relative inline-block mb-6">
                                    <Avatar className="h-32 w-32 mx-auto">
                                        <AvatarImage src={profile.avatar} alt={profile.name} />
                                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                                            {profile.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <Button
                                            size="sm"
                                            className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full bg-gradient-primary"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <div className="absolute -top-2 -right-2">
                                        <div className={`h-6 w-6 rounded-full border-2 border-card ${profile.status === 'online' ? 'bg-chat-online' : 'bg-chat-offline'
                                            }`} />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
                                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                                    {profile.status === 'online' ? 'Online' : 'Offline'}
                                </Badge>

                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    {profile.bio}
                                </p>

                                <div className="space-y-3 text-left">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{profile.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{profile.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{profile.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>Joined {profile.joined}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <Card className="bg-card border-border mt-6">
                            <CardHeader>
                                <CardTitle>Activity Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center">
                                            <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Form */}
                    <div className="lg:col-span-2">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isEditing ? (
                                    <>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={editForm.email}
                                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input
                                                    id="location"
                                                    value={editForm.location}
                                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                    className="bg-background border-border"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                rows={4}
                                                value={editForm.bio}
                                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                                className="bg-background border-border resize-none"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <Label className="text-muted-foreground">Full Name</Label>
                                                <p className="text-lg font-medium mt-1">{profile.name}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">Email Address</Label>
                                                <p className="text-lg font-medium mt-1">{profile.email}</p>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <Label className="text-muted-foreground">Phone Number</Label>
                                                <p className="text-lg font-medium mt-1">{profile.phone}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">Location</Label>
                                                <p className="text-lg font-medium mt-1">{profile.location}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-muted-foreground">Bio</Label>
                                            <p className="text-lg font-medium mt-1 leading-relaxed">{profile.bio}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Additional Settings */}
                        <Card className="bg-card border-border mt-6">
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Email Notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive email notifications for new messages</p>
                                    </div>
                                    <Button variant="outline" size="sm">Configure</Button>
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Privacy Settings</p>
                                        <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                                    </div>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium">Account Security</p>
                                        <p className="text-sm text-muted-foreground">Two-factor authentication and password settings</p>
                                    </div>
                                    <Button variant="outline" size="sm">Settings</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile