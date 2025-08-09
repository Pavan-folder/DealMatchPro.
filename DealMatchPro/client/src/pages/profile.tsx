import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/navigation/header";
import Sidebar from "@/components/navigation/sidebar";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: businessProfile } = useQuery({
    queryKey: ["/api/business/profile"],
    enabled: user?.userType === "seller",
  });

  const { data: buyerProfile } = useQuery({
    queryKey: ["/api/buyer/profile"],
    enabled: user?.userType === "buyer",
  });

  const updateBusinessMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/business/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your business profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    },
  });

  const updateBuyerMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/buyer/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buyer/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your buyer profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const profile = user?.userType === "seller" ? businessProfile : buyerProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <Header />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-poppins text-3xl font-bold text-primary-900 mb-2" data-testid="text-profile-title">
                  Profile Settings
                </h1>
                <p className="text-slate-600">
                  Manage your account information and preferences
                </p>
              </div>
              
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 border-red-300 hover:bg-red-50"
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Sign Out
              </Button>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
                <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
                <TabsTrigger value="billing" data-testid="tab-billing">Billing</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                
                {/* User Info Card */}
                <GlassmorphismCard className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={user?.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=80&h=80&fit=crop&crop=face`}
                      alt="Profile" 
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-poppins text-xl font-semibold text-primary-900" data-testid="text-user-name">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-slate-600">{user?.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                          {user?.userType === "seller" ? "Seller" : "Buyer"}
                        </span>
                        <span className="text-sm text-success-600">✓ Verified</span>
                      </div>
                    </div>
                  </div>
                </GlassmorphismCard>

                {/* Business/Buyer Profile */}
                {user?.userType === "seller" && (
                  <GlassmorphismCard className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-poppins text-xl font-semibold text-primary-900">Business Profile</h3>
                      <Button 
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                        data-testid="button-edit-profile"
                      >
                        {isEditing ? (
                          <>
                            <i className="fas fa-times mr-2"></i>
                            Cancel
                          </>
                        ) : (
                          <>
                            <i className="fas fa-edit mr-2"></i>
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>

                    {isEditing ? (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const data = Object.fromEntries(formData.entries());
                        updateBusinessMutation.mutate(data);
                      }}>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="name">Business Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              defaultValue={businessProfile?.name}
                              data-testid="input-business-name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="industry">Industry</Label>
                            <Select name="industry" defaultValue={businessProfile?.industry}>
                              <SelectTrigger data-testid="select-industry">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="annualRevenue">Annual Revenue</Label>
                            <Select name="annualRevenue" defaultValue={businessProfile?.annualRevenue}>
                              <SelectTrigger data-testid="select-revenue">
                                <SelectValue placeholder="Select revenue range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="under_1m">Under $1M</SelectItem>
                                <SelectItem value="1m_5m">$1M - $5M</SelectItem>
                                <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                                <SelectItem value="10m_50m">$10M - $50M</SelectItem>
                                <SelectItem value="over_50m">$50M+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="yearsInBusiness">Years in Business</Label>
                            <Input 
                              id="yearsInBusiness" 
                              name="yearsInBusiness" 
                              type="number"
                              defaultValue={businessProfile?.yearsInBusiness}
                              data-testid="input-years-in-business"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="description">Business Description</Label>
                            <Textarea 
                              id="description" 
                              name="description" 
                              defaultValue={businessProfile?.description}
                              rows={4}
                              data-testid="textarea-description"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 mt-6">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                            data-testid="button-cancel-edit"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={updateBusinessMutation.isPending}
                            className="bg-gradient-to-r from-primary-600 to-success-600"
                            data-testid="button-save-profile"
                          >
                            {updateBusinessMutation.isPending ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Business Name</div>
                          <div className="font-medium text-primary-900" data-testid="text-business-name">
                            {businessProfile?.name || "Not set"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Industry</div>
                          <div className="font-medium text-primary-900" data-testid="text-industry">
                            {businessProfile?.industry || "Not set"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Annual Revenue</div>
                          <div className="font-medium text-primary-900" data-testid="text-revenue">
                            {businessProfile?.annualRevenue || "Not set"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Years in Business</div>
                          <div className="font-medium text-primary-900" data-testid="text-years">
                            {businessProfile?.yearsInBusiness || "Not set"}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="text-sm text-slate-500 mb-1">Description</div>
                          <div className="text-primary-900" data-testid="text-description">
                            {businessProfile?.description || "No description provided"}
                          </div>
                        </div>
                      </div>
                    )}
                  </GlassmorphismCard>
                )}

                {user?.userType === "buyer" && (
                  <GlassmorphismCard className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-poppins text-xl font-semibold text-primary-900">Investment Profile</h3>
                      <Button 
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                        data-testid="button-edit-profile"
                      >
                        {isEditing ? (
                          <>
                            <i className="fas fa-times mr-2"></i>
                            Cancel
                          </>
                        ) : (
                          <>
                            <i className="fas fa-edit mr-2"></i>
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Budget Range</div>
                        <div className="font-medium text-primary-900" data-testid="text-budget">
                          {buyerProfile?.budgetRange || "Not set"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Experience Level</div>
                        <div className="font-medium text-primary-900" data-testid="text-experience">
                          {buyerProfile?.experience || "Not set"}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm text-slate-500 mb-1">Investment Focus</div>
                        <div className="text-primary-900" data-testid="text-focus">
                          {buyerProfile?.investmentFocus || "No focus specified"}
                        </div>
                      </div>
                    </div>
                  </GlassmorphismCard>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <GlassmorphismCard className="p-6">
                  <h3 className="font-poppins text-xl font-semibold text-primary-900 mb-6">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-primary-900">Email Notifications</div>
                        <div className="text-sm text-slate-600">Receive email updates about matches and deals</div>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked data-testid="toggle-email" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-primary-900">Push Notifications</div>
                        <div className="text-sm text-slate-600">Get push notifications on your device</div>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked data-testid="toggle-push" />
                    </div>
                  </div>
                </GlassmorphismCard>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <GlassmorphismCard className="p-6">
                  <h3 className="font-poppins text-xl font-semibold text-primary-900 mb-6">Billing Information</h3>
                  <div className="text-center py-12">
                    <i className="fas fa-credit-card text-4xl text-slate-400 mb-4"></i>
                    <h4 className="font-semibold text-slate-700 mb-2">No billing information on file</h4>
                    <p className="text-slate-500 mb-6">
                      DealConnect is currently free to use during our beta period.
                    </p>
                    <Button variant="outline" data-testid="button-add-payment">
                      <i className="fas fa-plus mr-2"></i>
                      Add Payment Method
                    </Button>
                  </div>
                </GlassmorphismCard>
              </TabsContent>
            </Tabs>

          </div>
        </main>
      </div>
    </div>
  );
}
