import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Menu, Search, UserCircle, Settings, LogOut, Database } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showError, setShowError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    minAmount: "",
    maxAmount: "",
    duration: "",
  });

  const profiles = [
    {
      id: 1,
      firstName: "Jean",
      lastName: "Dupont",
      loanAmount: 25000,
      status: "Validé",
      healthScore: 85,
      employabilityScore: 92,
      isRecent: true,
    },
    {
      id: 2,
      firstName: "Marie",
      lastName: "Martin",
      loanAmount: 15000,
      status: "En Attente",
      healthScore: 78,
      employabilityScore: 88,
      isRecent: false,
    },
  ];

  const handleLogin = (login, password) => {
    if (login === "beka" && password === "root") {
      setUserRole("Admin_Banquier");
      setIsLoggedIn(true);
    } else if (login === "admin_ygard" && password === "rooty") {
      setUserRole("Admin_ygard");
      setIsLoggedIn(true);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} showError={showError} />
      ) : (
        <Dashboard
          userRole={userRole}
          profiles={profiles}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          onLogout={() => setIsLoggedIn(false)}
        />
      )}
    </div>
  );
};

const LoginPage = ({ onLogin, showError }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">YGARD</h1>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center">Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                onLogin(login, password);
              }}
            >
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full" type="submit">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {showError && (
        <Alert className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-96 bg-red-100 border-red-400">
          <AlertDescription>
            Le mot de passe ou l'utilisateur est incorrect.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const Dashboard = ({
  userRole,
  profiles,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  onLogout,
}) => {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Dashboard Admin
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètre</span>
              </DropdownMenuItem>
              {userRole === "Admin_ygard" && (
                <DropdownMenuItem>
                  <Database className="mr-2 h-4 w-4" />
                  <span>Accès à la base de données</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
          />
          <ProfileList profiles={profiles} />
        </div>
      </main>
    </div>
  );
};

const SearchBar = ({ searchQuery, setSearchQuery, filters, setFilters }) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          className="flex-grow"
          placeholder="Rechercher par nom ou prénom..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut du prêt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="valide">Validé</SelectItem>
            <SelectItem value="refuse">Refusé</SelectItem>
            <SelectItem value="attente">En Attente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Input
          type="number"
          placeholder="Montant minimum"
          value={filters.minAmount}
          onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Montant maximum"
          value={filters.maxAmount}
          onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Durée du prêt (mois)"
          value={filters.duration}
          onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
        />
      </div>
    </div>
  );
};

const ProfileList = ({ profiles }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {profiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
};

const ProfileCard = ({ profile }) => {
  return (
    <Card className="transform transition-transform hover:scale-105">
      <CardContent className="p-6 relative">
        {profile.isRecent && (
          <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Récent
          </span>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-sm text-gray-500">
              Montant: {profile.loanAmount.toLocaleString()}€
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Score Santé</span>
              <span className="font-medium">{profile.healthScore}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Score Employabilité</span>
              <span className="font-medium">{profile.employabilityScore}%</span>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full">Voir le dossier</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;