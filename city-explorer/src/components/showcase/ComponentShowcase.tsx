import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showSuccessToast, showErrorToast } from "@/custom-components/Toast";
import CustomSelect from "@/custom-components/CustomSelect";
import CustomOverviewCard from "@/custom-components/CustomOverviewCard";
import CustomTextField from "@/components/inputs/CustomTextField";
import CustomTextArea from "@/components/inputs/CustomTextArea";
import CustomSuccessModal from "@/custom-components/CustomSuccessModal";
import CustomTable from "@/custom-components/CustomTable";
import {
  Star,
  Heart,
  Users,
  Settings,
  ChevronDown,
  Play,
  Pause,
  ShoppingCart,
} from "lucide-react";

const ComponentShowcase: React.FC = () => {
  const [progress, setProgress] = useState(65);
  const [selectValue, setSelectValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);

  const selectOptions = [
    { name: "Apple", value: "apple" },
    { name: "Banana", value: "banana" },
    { name: "Orange", value: "orange" },
    { name: "Grape", value: "grape" },
  ];

  const tableColumns = [
    { key: "name", header: "Name", filterable: true },
    { key: "email", header: "Email", filterable: true },
    { key: "role", header: "Role", filterable: false },
    { key: "status", header: "Status", filterable: false },
  ];

  const tableData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">shadcn/ui Component Showcase</h1>
        <p className="text-xl text-gray-600">Explore the converted UI components</p>
      </div>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Star className="h-4 w-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Standard Input</Label>
              <Input placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label>Select</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Textarea</Label>
              <Textarea placeholder="Enter your message" />
            </div>
            <div className="space-y-2">
              <Label>Custom Select</Label>
              <CustomSelect
                options={selectOptions}
                placeholder="Choose a fruit"
                value={selectValue}
                onChange={setSelectValue}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomTextField
              label="Custom Text Field"
              placeholder="Enter text"
              register={{}}
              type="text"
            />
            <CustomTextField
              label="Password Field"
              placeholder="Enter password"
              register={{}}
              type="password"
              checkPassword={true}
            />
          </div>

          <CustomTextArea
            label="Custom Text Area"
            placeholder="Enter your message"
            register={{}}
          />
        </CardContent>
      </Card>

      {/* Interactive Components */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={switchChecked}
              onCheckedChange={setSwitchChecked}
            />
            <Label htmlFor="notifications">Enable notifications</Label>
          </div>

          <div className="space-y-2">
            <Label>Progress: {progress}%</Label>
            <Progress value={progress} className="w-full" />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setProgress(Math.max(0, progress - 10))}
              >
                Decrease
              </Button>
              <Button
                size="sm"
                onClick={() => setProgress(Math.min(100, progress + 10))}
              >
                Increase
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards and Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Cards and Badges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomOverviewCard
              title="Total Users"
              icon={<Users className="h-6 w-6 text-blue-500" />}
              onClick={() => showSuccessToast("Users card clicked!")}
            />
            <CustomOverviewCard
              title="Settings"
              icon={<Settings className="h-6 w-6 text-green-500" />}
              onClick={() => showSuccessToast("Settings card clicked!")}
            />
            <CustomOverviewCard
              title="Orders"
              icon={<ShoppingCart className="h-6 w-6 text-purple-500" />}
              onClick={() => showSuccessToast("Orders card clicked!")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Avatar and Dropdown */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar and Dropdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Open Menu <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* Dialog and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog and Table</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Button onClick={() => setShowModal(true)}>
              Show Success Modal
            </Button>

            <Button onClick={() => showSuccessToast("Success toast!")}>
              Success Toast
            </Button>

            <Button onClick={() => showErrorToast("Error toast!")}>
              Error Toast
            </Button>
          </div>

          <CustomTable
            columns={tableColumns}
            data={tableData}
            actions={
              <Button size="sm" variant="outline">
                Add User
              </Button>
            }
          />
        </CardContent>
      </Card>

      <CustomSuccessModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        message="Component showcase completed successfully!"
        viewButton={true}
      />
    </div>
  );
};

export default ComponentShowcase;