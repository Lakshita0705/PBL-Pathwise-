
import React from 'react';
import { Mentor } from '@/types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
            <AvatarFallback>{mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{mentor.name}</h3>
            <p className="text-sm text-muted-foreground">{mentor.yearsOfExperience} years of experience</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-3">{mentor.bio}</p>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {mentor.skills.map((skill, index) => (
              <span key={index} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Availability: </span>
            <span className="font-medium capitalize">{mentor.availability}</span>
          </div>
          {mentor.hourlyRate && (
            <div>
              <span className="text-muted-foreground">Book Now </span>
              <span className="font-medium">Rs {mentor.hourlyRate}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/mentors/${mentor.id}`} className="w-full">
          <Button className="w-full">Connect</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MentorCard;
