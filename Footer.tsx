
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <img
                src="/images/Pathwise-logo.png"
                alt="PathWise Logo"
                className="h-8 w-8"
              />
              <span>PathWise</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Navigate your Future with Confidence
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/roadmap" className="text-muted-foreground hover:text-foreground">
                  Learning Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Progress Tracking
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="text-muted-foreground hover:text-foreground">
                  Connect with Mentors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Community
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
