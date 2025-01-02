import React, { useContext, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Menu, UserCircle, Settings, LogOut, Database } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { UserContext } from "../main"; // Importation du contexte utilisateur global

const AdminDashboard = () => {
  const { user, setUser, decisions } = useContext(UserContext); // Utilisation du contexte utilisateur
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [searchQuery, setSearchQuery] = useState("");

  const profiles = [
    {
      id: 1,
      firstName: "Jean",
      lastName: "Dupont",
      loanAmount: 25000,
      status: "Favorable",
      healthScore: 85,
      employabilityScore: 92,
      isRecent: true,
    },
    {
      id: 2,
      firstName: "Marie",
      lastName: "Martin",
      loanAmount: 15000,
      status: "Non favorable",
      healthScore: 78,
      employabilityScore: 88,
      isRecent: false,
    },
  ];

  const handleLogin = (login, password) => {
    if (login === "beka" && password === "root") {
      setUser("beka");
      setIsLoggedIn(true);
    } else if (login === "admin_ygard" && password === "rooty") {
      setUser("admin_ygard");
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
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
                {user === "admin_ygard" && (
                  <DropdownMenuItem>
                    <Database className="mr-2 h-4 w-4" />
                    <span>Accès à la base de données</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setUser(null)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main>
          <div className="grid gap-6">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} decision={decisions[profile.id]} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Connexion</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!login || !password) {
              setShowError(true);
              setTimeout(() => setShowError(false), 3000);
              return;
            }
            onLogin(login, password);
          }}
        >
          <Input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full mt-4">
            Se connecter
          </Button>
        </form>
        {showError && (
          <Alert className="mt-4">
            <AlertDescription>
              Login ou mot de passe incorrect. Veuillez réessayer.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

const ProfileCard = ({ profile, decision }) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transform hover:scale-105 transition-transform">
      <CardContent>
        <h3 className="text-lg font-bold">
          {profile.firstName} {profile.lastName}
        </h3>
        <p>Montant demandé: {profile.loanAmount.toLocaleString()}€</p>
        <p className="mt-2">
          Statut de décision :{" "}
          <span
            className={
              decision === "validé" ? "text-green-600" : decision === "non validé" ? "text-red-600" : "text-gray-500"
            }
          >
            {decision || "Non évalué"}
          </span>
        </p>
        <Button
          className="mt-4 w-full"
          onClick={() => navigate("/borrower", { state: profile })}
        >
          Voir le dossier
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
