
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface HeaderProps {
  onBack: () => void;
}

const Header = ({ onBack }: HeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center mb-6"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onBack}
        className="mr-4"
      >
        <ArrowLeft size={18} />
      </Button>
      <h1 className="text-2xl font-bold">Settings</h1>
    </motion.div>
  );
};

export default Header;
