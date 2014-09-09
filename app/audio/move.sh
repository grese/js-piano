#!/bin/bash
filename="$1"
newfilename="$2"
mp3file="$filename.mp3"
oggfile="$filename.ogg"
newmp3="$newfilename.mp3"
newogg="$newfilename.ogg"
mv $mp3file $newmp3
mv $oggfile $newogg
