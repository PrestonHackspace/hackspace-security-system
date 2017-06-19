#!/bin/bash

md5=$(echo $1 | md5sum | awk '{ print $1 }')

echo $md5;

if [ ! -f /tmp/$md5.wav ]; then
  echo 'Generating speech...'
  pico2wave -w /tmp/$md5.wav "$1"
fi

aplay /tmp/$md5.wav
